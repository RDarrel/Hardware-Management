import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import Docx from "../../../../components/docx";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { UPDATE } from "../../../../services/redux/slices/tasks";

export default function Modal({ show, toggle, selected }) {
  const { isLoading, message, isSuccess } = useSelector(({ tasks }) => tasks),
    { token } = useSelector(({ auth }) => auth),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty()),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected.details) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(selected.details))
        )
      );
    }
  }, [selected]);

  const handleSubmit = () => {
    dispatch(
      UPDATE({
        data: {
          _id: selected._id,
          isDone: true,
          details: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
        },
        token,
      })
    );

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
        Viewing {selected.name}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <Docx
          editorState={editorState}
          _className="border"
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
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            color="success"
            className="mb-2"
            rounded
          >
            Done
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
