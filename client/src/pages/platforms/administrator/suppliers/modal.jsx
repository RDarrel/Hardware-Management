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
  MDBTable,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  UPDATE,
} from "../../../../services/redux/slices/administrator/suppliers";
import { isEqual } from "lodash";

const _form = {
  name: "",
  description: "",
  capacity: 50,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { token } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ suppliers }) => suppliers),
    [contacts, setContacts] = useState([]),
    [contact, setContact] = useState(""),
    [form, setForm] = useState(_form),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (!willCreate && selected._id) setForm(selected);
  }, [willCreate, selected]);

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

  const { name, description, capacity } = form;

  const handleRemove = (index) => {
    const copyContacts = [...contacts];
    copyContacts.splice(index, 1);
    setContacts(copyContacts);
  };

  const handleUpdateContact = (index) => {
    const copyContacts = [...contacts];
    copyContacts[index] = contact;
    setContacts(copyContacts);
  };

  const handleAddContact = () => {
    const copyContacts = [...contacts];
    copyContacts.push(contact);
    setContacts(copyContacts);
  };

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
        <MDBIcon icon="user" className="mr-2" />
        {!willCreate ? "Update" : "Create"} a Supplier
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput type="text" label="Company Name" />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput type="text" label="Location" />
            </MDBCol>
          </MDBRow>

          <form onSubmit={handleAddContact}>
            <MDBRow className="d-flex align-items-center">
              <MDBCol md="10">
                <MDBInput
                  type="text"
                  label="Contact"
                  required
                  value={contact}
                  onChange={({ target }) => setContact(target.value)}
                />
              </MDBCol>
              <MDBCol md="2" className="d-flex justify-content-end">
                <MDBBtn size="sm" color="success" type="submit">
                  <MDBIcon icon="plus" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </form>
          {contacts.length > 0 && (
            <MDBRow>
              <MDBCol md="12">
                <h5>Contact List</h5>
                <MDBTable>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </MDBTable>
              </MDBCol>
            </MDBRow>
          )}

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
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
