import React from "react";
import { MDBRow, MDBCol, MDBCardBody, MDBCard, MDBInput } from "mdbreact";
import { categories } from "../../services/fakeDb";
import materials from "../../services/fakeDb/materials";
import CustomSelect from "../../components/customSelect";

function Basic({ form, setForm }) {
  return (
    <MDBRow>
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h4 className="font-weight-bold">Basic Information</h4>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Product Name</h5>
              </MDBCol>
              <MDBCol md="10">
                <MDBInput
                  label="Product Name"
                  value={form.name}
                  required
                  onChange={({ target }) =>
                    setForm({ ...form, name: target.value })
                  }
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Product Description</h5>
              </MDBCol>
              <MDBCol md="10">
                <MDBInput
                  label="Description"
                  type="textarea"
                  required
                  value={form.description}
                  onChange={({ target }) =>
                    setForm({ ...form, description: target.value })
                  }
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Category</h5>
              </MDBCol>
              <MDBCol md="10">
                <CustomSelect
                  choices={categories}
                  label={"Category"}
                  preValue={form.category}
                  onChange={(value) => setForm({ ...form, category: value })}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h6>* This Product is Per Kilo?</h6>
              </MDBCol>
              <MDBCol md="10">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="yes"
                  checked={form.isPerKilo}
                  onChange={() => setForm({ ...form, isPerKilo: true })}
                />
                <label
                  htmlFor="yes"
                  className="form-check-label mr-2 label-table"
                >
                  Yes
                </label>

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="no"
                  checked={!form.isPerKilo}
                  onChange={() => setForm({ ...form, isPerKilo: false })}
                />
                <label
                  htmlFor="no"
                  className="form-check-label ml-3 label-table"
                >
                  No
                </label>
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h5>* Material</h5>
              </MDBCol>
              <MDBCol md="10">
                <CustomSelect
                  choices={materials}
                  label={"Material"}
                  preValue={form.material}
                  onChange={(value) => setForm({ ...form, material: value })}
                />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default Basic;
