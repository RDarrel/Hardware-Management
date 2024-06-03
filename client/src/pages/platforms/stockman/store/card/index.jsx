import React from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBCardImage,
} from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";

export const ProducCard = ({ index, product, setIsView, setSelected }) => {
  return (
    <MDBCol md="3" className="mt-4" key={index}>
      <section>
        <MDBCard style={{ maxHeight: "300px", height: "250px" }}>
          <div className="d-flex justify-content-center">
            <MDBCardImage
              top
              zoom
              waves
              className="img-fluid d-flex justify-content-center"
              src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
              style={{ height: "160px", width: "70%" }}
            />
          </div>
          <MDBBtn
            floating
            color="light"
            tag="a"
            className="ml-auto mr-4 lighten-3 mdb-color"
            onClick={() => {
              setIsView(true);
              setSelected(product);
            }}
            action
          >
            <MDBIcon icon="eye" />
          </MDBBtn>

          <MDBCardBody>
            <h6 className="text-truncate mt-3">{product.name}</h6>
          </MDBCardBody>
        </MDBCard>
      </section>
    </MDBCol>
  );
};
