import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import Docx from "../../../../../components/docx";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import {
  SAVE,
  UPDATE,
  CUSTOMALERT,
} from "../../../../../services/redux/slices/tasks";

const levels = ["Low", "Medium", "High"];

export default function Modal({
  show,
  toggle,
  selected,
  willCreate,
  isActive,
}) {
  const { isLoading, message, isSuccess } = useSelector(({ tasks }) => tasks),
    projects = useSelector(({ projects }) => projects.collections),
    [developers, setDevelopers] = useState([]),
    { token } = useSelector(({ auth }) => auth),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty()),
    [form, setForm] = useState({
      name: "",
      developer: "",
      project: "",
      intensity: 1,
      isDone: false,
      importance: "Medium",
    }),
    dispatch = useDispatch();

  useEffect(() => {
    if (form.project) {
      const project = projects.find(e => e._id === form.project);
      setDevelopers(project.developers);
    }
  }, [form, projects]);

  useEffect(() => {
    if (selected._id) {
      if (selected.details) {
        setEditorState(
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(selected.details))
          )
        );
      }

      setForm({
        ...selected,
        developer: selected.developer?._id,
        project: selected.project?._id,
        projectName: selected.project?.name,
      });
    }
  }, [selected]);

  const handleUpdate = () =>
    dispatch(
      UPDATE({
        data: {
          ...form,
          details: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
        },
        token,
      })
    );

  const handleSave = () =>
    dispatch(
      SAVE({
        data: {
          ...form,
          details: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
        },
        token,
      })
    );

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.project) return dispatch(CUSTOMALERT("Please choose a project."));

    if (!form.developer)
      return dispatch(CUSTOMALERT("Please choose a developer."));

    if (willCreate) {
      handleSave();
    } else {
      handleUpdate();
    }
    toggle();
  };

  return (
    <MDBModal
      size="lg"
      isOpen={show}
      toggle={toggle}
      backdrop={true}
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="todo" className="mr-2" />
        {willCreate ? "Create" : isActive ? "Update" : "View"}&nbsp;
        {selected.name || "a Task"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            type="text"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            label="Name"
            required
          />
          <MDBRow>
            <MDBCol size="6">
              <MDBSelect
                getValue={e => {
                  setForm({
                    ...form,
                    importance: e[0],
                  });
                }}
                className="colorful-select dropdown-primary hidden-md-down"
                label="Importance"
              >
                <MDBSelectInput />
                <MDBSelectOptions>
                  {levels.map((level, index) => {
                    let isSelected = false;

                    if (form.importance === level) {
                      isSelected = true;
                    }

                    return (
                      <MDBSelectOption
                        key={`project-list-${index}`}
                        value={level}
                        selected={isSelected}
                      >
                        {level}
                      </MDBSelectOption>
                    );
                  })}
                </MDBSelectOptions>
              </MDBSelect>
            </MDBCol>
            <MDBCol size="6">
              <MDBInput
                type="number"
                value={form.intensity}
                onChange={e =>
                  handleChange("intensity", Number(e.target.value))
                }
                label="Complexity Rating"
                min={1}
                max={10}
                required
              />
            </MDBCol>
          </MDBRow>
          {!willCreate && (
            <MDBInput
              type="text"
              value={form.projectName}
              label="Project"
              readOnly
            />
          )}
          {willCreate && (
            <MDBSelect
              getValue={e => {
                setForm({
                  ...form,
                  project: e[0],
                  developer: "",
                });
                //empty the array so the select can reload
                setDevelopers([]);
              }}
              className="colorful-select dropdown-primary hidden-md-down"
              label="Project"
            >
              <MDBSelectInput />
              <MDBSelectOptions>
                {projects.map((project, index) => {
                  let isSelected = false;

                  if (selected._id) {
                    if (selected.project?._id === project._id) {
                      isSelected = true;
                    }
                  }

                  return (
                    <MDBSelectOption
                      key={`project-list-${index}`}
                      value={project._id}
                      selected={isSelected}
                    >
                      {project.name}
                    </MDBSelectOption>
                  );
                })}
              </MDBSelectOptions>
            </MDBSelect>
          )}
          {developers.length > 0 && (
            <MDBSelect
              getValue={e => handleChange("developer", e[0])}
              className="colorful-select dropdown-primary hidden-md-down"
              label="Developer"
            >
              <MDBSelectInput />
              <MDBSelectOptions>
                {developers.map((dev, index) => {
                  let isSelected = false;

                  if (selected._id) {
                    if (form.developer === dev._id) {
                      isSelected = true;
                    }
                  }

                  return (
                    <MDBSelectOption
                      key={`developer-list-${index}`}
                      value={dev._id}
                      selected={isSelected}
                    >
                      {fullName(dev.fullName)}
                    </MDBSelectOption>
                  );
                })}
              </MDBSelectOptions>
            </MDBSelect>
          )}
          <Docx
            editorState={editorState}
            _className="mt-5 border"
            setEditorState={setEditorState}
            _style={{ minHeight: "200px" }}
          />
          {message && (
            <div
              className={`alert alert-${
                isSuccess ? "success" : "warning"
              } text-center mt-3`}
            >
              {message}
            </div>
          )}
          <div className="text-center mb-1-half">
            <MDBBtn
              type={isActive ? "submit" : "button"}
              onClick={() => {
                if (!isActive) {
                  toggle();
                }
              }}
              disabled={isLoading}
              color="info"
              className="mb-2"
              outline={!isActive}
              rounded
            >
              {willCreate ? "submit" : isActive ? "update" : "close"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
