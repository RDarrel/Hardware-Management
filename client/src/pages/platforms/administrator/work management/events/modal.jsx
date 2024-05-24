import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import { SAVE, UPDATE } from "../../../../../services/redux/slices/events";
import moment from "moment";

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, message, isSuccess } = useSelector(({ tasks }) => tasks),
    { token, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({
      title: "",
      start: moment().format("YYYY-MM-DDTHH:mm"),
      end: moment().format("YYYY-MM-DDTHH:mm"),
      by: auth?._id,
    }),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected._id) {
      setForm(selected);
    }
  }, [selected]);

  const handleUpdate = () =>
    dispatch(
      UPDATE({
        data: form,
        token,
      })
    );

  const handleSave = () =>
    dispatch(
      SAVE({
        data: form,
        token,
      })
    );

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = e => {
    e.preventDefault();

    if (willCreate) {
      handleSave();
    } else {
      handleUpdate();
    }
    toggle();
  };

  return (
    <MDBModal
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
        {willCreate ? "Create" : "Update"}&nbsp;
        {selected.name || "an Event"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            type="text"
            value={form.title}
            onChange={e => handleChange("title", e.target.value)}
            label="Title"
            required
          />
          <MDBRow className="mt-0">
            <MDBCol md="6">
              <MDBInput
                type="datetime-local"
                value={form.start}
                onChange={e => handleChange("start", e.target.value)}
                label="Start"
                required
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="datetime-local"
                value={form.end}
                onChange={e => handleChange("end", e.target.value)}
                label="End"
                required
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
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
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
