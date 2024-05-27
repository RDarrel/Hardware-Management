import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
} from "mdbreact";
import React from "react";
import Table from "./table";

function Variations({ variations = [], setVariations }) {
  const handleChangeOptions = () => {};
  return (
    <>
      {variations.map((variation, index) => (
        <React.Fragment key={`main-variation-${index}`}>
          <MDBRow className="mt-5" key={index}>
            <MDBCol md="2" className="d-flex justify-content-end ">
              <h5>{variation.title}</h5>
            </MDBCol>
            <MDBCol md="8">
              <MDBCard
                className="bg-light"
                style={{ boxShadow: "0px 0px 0px 0px" }}
              >
                <MDBRow>
                  <MDBCol md="12" className="d-flex justify-content-end  ">
                    <MDBIcon icon="times" className="mr-3 mt-2" />
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol
                      md="2"
                      className="d-flex justify-content-end align-items-center"
                    >
                      <h5>Name</h5>
                    </MDBCol>
                    <MDBCol md="8">
                      <input
                        className="form-control"
                        placeholder="Enter Variation Name eg: colour, etc"
                      />
                    </MDBCol>
                  </MDBRow>
                  {variation.options.map((option, indexOption) => (
                    <MDBRow
                      key={`variation-option-${indexOption}`}
                      className=" d-flex align-items-center"
                    >
                      <MDBCol
                        md="2"
                        className="d-flex justify-content-end align-items-center"
                      >
                        {indexOption === 0 && <h5>Options</h5>}
                      </MDBCol>
                      <MDBCol md="8" className="mt-2 mb-3">
                        <input
                          className="form-control"
                          placeholder="Enter Variation Options eg: Red, etc"
                          value={option}
                          onChange={(e) => handleChangeOptions(e.target.value)}
                        />
                      </MDBCol>
                      <MDBCol>
                        <MDBIcon icon="trash-alt" className="cursor-pointer" />
                      </MDBCol>
                    </MDBRow>
                  ))}
                  <MDBRow
                    className="d-flex justify-content-center"
                    key={`variation-option-add-${index}`}
                  >
                    <MDBCol md="8">
                      <MDBBtn
                        color="white"
                        className="add-price-tier-button  d-flex align-items-center justify-content-center"
                        block
                      >
                        <MDBIcon icon="plus" className="blue-text" />
                        <span className="blue-text ">Add Options (1/20)</span>
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          {/* <MDBRow className="mt-5" key={`addVaration-${index}`}>
            <MDBCol md="2" className="d-flex justify-content-end ">
              <h5>Variation {variations.length + 1}</h5>
            </MDBCol>
            <MDBCol md="6">
              <MDBBtn
                color="white"
                className="add-price-tier-button  d-flex align-items-center justify-content-center"
                block
              >
                <MDBIcon icon="plus" className="blue-text" />
                <span className="blue-text ">Add</span>
              </MDBBtn>
            </MDBCol>
          </MDBRow> */}
        </React.Fragment>
      ))}

      <MDBRow className="d-flex align-items-center mt-4">
        <MDBCol
          md="2"
          className="d-flex justify-content-end align-content-center "
        >
          <h5>Variation Information</h5>
        </MDBCol>
        <MDBCol md="8">
          <MDBInputGroup prepend="₱" type="number" />
        </MDBCol>
        <MDBCol md="2">
          <MDBBtn color="danger" block>
            Apply To All
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <Table variations={variations} setVariations={setVariations} />
    </>
  );
}

export default Variations;
