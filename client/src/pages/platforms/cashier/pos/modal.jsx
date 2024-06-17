import React, { useState } from "react";
import Swal from "sweetalert2";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";

import Variations from "../../../widgets/variations";

export default function Modal({ show, toggle, selected, handleAddOrder }) {
  const [variant1, setVariant1] = useState(""),
    [variant2, setVariant2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrder({ ...selected, variant1, variant2 });
    Swal.fire({
      title: "Successfully added to your order",
      icon: "success",
    });
  };

  const handleClose = () => {
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="lg">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <div>
          <h5 className="text-truncate" style={{ width: "700px" }}>
            {selected.name}
          </h5>
        </div>
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <Variations
            variant1={variant1}
            setVariant1={setVariant1}
            variant2={variant2}
            setVariant2={setVariant2}
            has2Variant={selected?.variations?.length > 1}
            variations={selected.variations}
            isCart={true}
            setPrice={() => {}}
          />
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              color="success"
              size="md"
              className="mb-2 float-right"
            >
              Add to order
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
