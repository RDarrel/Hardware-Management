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
} from "../../../../../services/redux/slices/projects";

export default function Modal({
  show,
  toggle,
  selected,
  willCreate,
  isActive,
}) {
  const { collections } = useSelector(({ users }) => users),
    { isLoading, message, isSuccess } = useSelector(({ projects }) => projects),
    [developers, setDevelopers] = useState([]),
    [clients, setClients] = useState([]),
    { token } = useSelector(({ auth }) => auth),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty()),
    [form, setForm] = useState({
      name: "",
      client: "",
      developers: [],
      duration: {
        start: new Date().toLocaleString(),
        end: "",
      },
      price: 0,
    }),
    dispatch = useDispatch();

  useEffect(() => {
    const handleInject = async () => {
      if (selected._id) {
        let updates = {
          _id: selected._id,
          status: selected.status,
          developers: [],
          name: selected.name,
          duration: selected.duration,
          price: selected.price,
          client: "",
        };

        if (selected.client && selected.client._id) {
          updates.client = selected.client._id;
        }

        if (selected.developers.length > 0) {
          await selected.developers.forEach(dev => {
            updates.developers.push(dev._id);
          });
        }

        if (selected.details) {
          setEditorState(
            EditorState.createWithContent(
              convertFromRaw(JSON.parse(selected.details))
            )
          );
        }

        setForm(updates);
      }
    };

    handleInject();
  }, [selected]);

  const handleUpdate = () =>
    dispatch(
      UPDATE({
        data: form,
        token,
      })
    );

  const handleDone = () => {
    dispatch(
      UPDATE({
        data: {
          ...form,
          duration: {
            ...form.duration,
            end: new Date().toLocaleString(),
          },
        },
        token,
      })
    );

    toggle();
  };

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

    if (isActive) {
      if (!form.client) return dispatch(CUSTOMALERT("Please choose a client."));

      if (form.developers.length === 0)
        return dispatch(CUSTOMALERT("Please select at least one developer."));

      if (willCreate) {
        handleSave();
      } else {
        handleUpdate();
      }
    }
    toggle();
  };

  useEffect(() => {
    setDevelopers(collections.filter(e => e.role?.name === "DEVELOPER"));
    setClients(collections.filter(e => e.role?.name === "CLIENT"));
  }, [collections]);

  return (
    <MDBModal
      size="xl"
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
        {willCreate ? "Create" : "Update"} {selected.name || "a Project"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="text"
                value={form.name}
                onChange={e =>
                  handleChange("name", e.target.value.toUpperCase())
                }
                label="Name"
                required
              />
              <MDBRow>
                <MDBCol md="6">
                  <MDBSelect
                    getValue={e => handleChange("client", e[0])}
                    className="colorful-select dropdown-primary hidden-md-down"
                    label="Client"
                  >
                    <MDBSelectInput />
                    <MDBSelectOptions>
                      {clients.map((client, index) => {
                        let isSelected = false;

                        if (selected._id) {
                          if (selected.client?._id === client._id) {
                            isSelected = true;
                          }
                        }

                        return (
                          <MDBSelectOption
                            key={`client-list-${index}`}
                            value={client._id}
                            selected={isSelected}
                          >
                            {fullName(client.fullName)}
                          </MDBSelectOption>
                        );
                      })}
                    </MDBSelectOptions>
                  </MDBSelect>
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput
                    type="number"
                    value={form.price}
                    onChange={e =>
                      handleChange("price", Number(e.target.value))
                    }
                    label="Price"
                    min={1}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBSelect
                multiple
                getValue={e => handleChange("developers", e)}
                className="colorful-select dropdown-primary hidden-md-down"
                label="Developers"
              >
                <MDBSelectInput />
                <MDBSelectOptions>
                  {developers.map((devs, index) => {
                    let isSelected = false;

                    if (selected._id) {
                      const _devs = selected.developers;
                      if (
                        _devs.length > 0 &&
                        _devs.some(e => e._id === devs._id)
                      ) {
                        isSelected = true;
                      }
                    }

                    return (
                      <MDBSelectOption
                        key={`devs-list-${index}`}
                        value={devs._id}
                        selected={isSelected}
                      >
                        {fullName(devs.fullName)}
                      </MDBSelectOption>
                    );
                  })}
                </MDBSelectOptions>
              </MDBSelect>
            </MDBCol>
            <MDBCol md="6">
              <Docx
                editorState={editorState}
                _className="mt-5 border"
                setEditorState={setEditorState}
                _style={{ minHeight: "230px" }}
              />
            </MDBCol>
          </MDBRow>
          {message && (
            <div
              className={`alert alert-${
                isSuccess ? "success" : "warning"
              } text-center mt-3`}
            >
              {message}
            </div>
          )}
          <div
            className={`${
              willCreate ? "text-center" : "d-flex justify-content-between"
            } mb-1-half`}
          >
            {!willCreate && (
              <MDBBtn
                type="button"
                onClick={handleDone}
                disabled={isLoading || (!isActive && !willCreate)}
                color="success"
                className="mb-2"
                rounded
              >
                done
              </MDBBtn>
            )}
            <MDBBtn
              type="submit"
              disabled={isLoading || (!isActive && !willCreate)}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
