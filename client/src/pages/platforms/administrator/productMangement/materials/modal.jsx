import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBTypography,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/administrator/productManagement/materials";
import { isEqual } from "lodash";
import { isValid } from "../../../../../services/utilities";

const _form = {
  name: "",
};

export default function Modal({
  show,
  toggle,
  selected,
  willCreate,
  collections = [],
}) {
  const { token } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ materials }) => materials),
    [isDuplicate, setIsDuplicate] = useState(false),
    [form, setForm] = useState(_form),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (!willCreate && selected._id) setForm(selected);
  }, [willCreate, selected]);

  useEffect(() => {
    if (form.name) {
      setIsDuplicate(isValid(collections, form.name, "name", selected?.name));
    }
  }, [form, collections, selected]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!willCreate) {
      if (isEqual(form, selected)) {
        addToast("No changes found, skipping update.", {
          appearance: "info",
        });
      } else {
        dispatch(
          UPDATE({
            data: form,
            token,
          })
        );
      }
    } else {
      dispatch(SAVE({ data: form, token }));
    }

    setForm(_form);
    toggle();
  };

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="toolbox" className="mr-2" />
        {!willCreate ? "Update" : "Create"} a Material
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="text"
                label="Name"
                value={form.name}
                required
                onChange={(event) =>
                  handleChange("name", event.target.value.toUpperCase())
                }
              />
            </MDBCol>
          </MDBRow>

          <div
            className={`d-flex justify-content-${
              isDuplicate ? "between" : "end"
            } mb-1-half mt-4 align-items-center`}
          >
            {isDuplicate && (
              <MDBTypography
                variant="h6"
                className="mb-0 text-black-50"
                noteColor="danger"
                note
                noteTitle="Warning: "
              >
                Sorry But this material is Already Exist
              </MDBTypography>
            )}
            <MDBBtn
              type="submit"
              disabled={isDuplicate || isLoading}
              color="primary"
              className="mb-2 float-right"
            >
              {!willCreate ? "Update" : "Submit"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
