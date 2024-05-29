import React from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";
import ProductImg from "./mediaPlaceHolder/product";
import OptionImg from "./mediaPlaceHolder/variant";

function Media({ handleDrop, media, dragOver, setMedia, variations }) {
  return (
    <MDBRow className="mt-3">
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h5 className="font-weight-bold">Media Management</h5>
            <MDBRow>
              <MDBCol md="2" className="d-flex justify-content-end ">
                <h6 className="mt-4">Product Images</h6>
              </MDBCol>
              <MDBCol>
                <MDBRow>
                  {media?.product?.map(({ preview: img, label }, index) => (
                    <MDBCol
                      key={index}
                      md="1"
                      className="mr-5"
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ img, index, title: "product" })
                        );
                      }}
                      onDragOver={dragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <ProductImg
                        index={index}
                        media={media}
                        label={label}
                        setMedia={setMedia}
                        img={img}
                      />
                    </MDBCol>
                  ))}
                </MDBRow>
              </MDBCol>
            </MDBRow>

            {variations.length > 0 && (
              <MDBRow>
                <MDBCol md="2" className="d-flex justify-content-end ">
                  <h6 className="mt-4">{variations[0].name || "Name"}</h6>
                </MDBCol>
                <MDBCol>
                  <MDBRow>
                    {media.variant?.options?.map(
                      ({ preview: img, label }, index) => (
                        <MDBCol
                          key={index}
                          md="1"
                          className="mr-5"
                          draggable="true"
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              JSON.stringify({ img, index, title: "variant" })
                            );
                          }}
                          onDragOver={dragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <OptionImg
                            index={index}
                            label={label}
                            media={media}
                            setMedia={setMedia}
                            img={img}
                          />
                        </MDBCol>
                      )
                    )}
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Media;
