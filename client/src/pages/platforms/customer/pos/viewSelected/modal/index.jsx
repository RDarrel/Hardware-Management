import React from "react";
import { MDBModal, MDBModalBody } from "mdbreact";
import { FullView } from "../../../../stockman/store/view/fullView";

export default function Modal({
  show,
  setShow,
  selected,
  images,
  imgForFullView,
}) {
  return (
    <MDBModal
      isOpen={show}
      toggle={() => setShow(false)}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalBody className="mb-0">
        <FullView
          setIsFullView={setShow}
          imgForFullView={imgForFullView}
          images={images}
          selected={selected}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
