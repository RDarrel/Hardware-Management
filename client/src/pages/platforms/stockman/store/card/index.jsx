import React, { useState } from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardImage } from "mdbreact";
import { ENDPOINT } from "../../../../../services/utilities";

export const ProducCard = ({ index, product, setIsView, setSelected }) => {
  const [didHover, setDidHover] = useState(false);
  return (
    <MDBCol md="3" className="mt-4" key={index}>
      <section>
        <MDBCard
          onMouseOver={() => setDidHover(true)}
          onMouseLeave={() => setDidHover(false)}
          style={{
            maxHeight: "300px",
            height: "250px",
            transform: didHover ? "translateY(-8px)" : "",
            transition: "transform 0.3s ease-in-out",
          }}
          className={`h-100 cursor-pointer transition-all z-depth-${
            didHover ? "2" : "1"
          }`}
          onClick={() => {
            setIsView(true);
            setSelected(product);
          }}
        >
          <div className="d-flex justify-content-center">
            <MDBCardImage
              top
              waves
              className="img-fluid d-flex justify-content-center"
              src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
              style={{ height: "160px", width: "70%" }}
            />
          </div>
          {/* <MDBBtn
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
          </MDBBtn> */}

          <MDBCardBody>
            <h6
              className="text-truncate title mt-3"
              style={{ fontWeight: 450 }}
            >
              {product.name}
            </h6>
          </MDBCardBody>
        </MDBCard>
      </section>
    </MDBCol>
  );
};
