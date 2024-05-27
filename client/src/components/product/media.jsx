import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import ImagePlaceholder from "./ImagePlaceHolder";

function Media({ handleDrop, labels, dragOver, setLabels }) {
  return (
    <MDBRow className="mt-3">
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h4 className="font-weight-bold">Media Management</h4>
            <MDBRow>
              <MDBCol md="2" className="d-flex justify-content-end ">
                <h5 className="mt-4">Product Images</h5>
              </MDBCol>
              <MDBCol>
                <MDBRow>
                  {labels.map(({ img, label }, index) => (
                    <MDBCol
                      key={index}
                      md="1"
                      className="mr-5"
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ img, index })
                        );
                      }}
                      onDragOver={dragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <ImagePlaceholder
                        index={index}
                        label={label}
                        setLabels={setLabels}
                        img={img}
                      />
                    </MDBCol>
                  ))}
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Media;
