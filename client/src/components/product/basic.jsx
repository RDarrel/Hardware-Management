import React from "react";
import { MDBRow, MDBCol, MDBCardBody, MDBCard, MDBInput } from "mdbreact";
import { categories } from "../../services/fakeDb";
import materials from "../../services/fakeDb/materials";
import CustomSelect from "../../components/customSelect";

function Basic({ form, setForm, selected }) {
  return (
    <MDBRow>
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <h5 className="font-weight-bold">Basic Information</h5>
            <MDBRow className="mt-5">
              <MDBCol
                md="2"
                className="d-flex justify-content-end align-items-center"
              >
                <h6>* Product Name</h6>
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
                sm="4"
                className="d-flex justify-content-end align-items-center "
              >
                <h6 className="text-nowrap">* Product Description</h6>
              </MDBCol>
              <MDBCol md="10" sm="8">
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
                <h6>* Category</h6>
              </MDBCol>
              <MDBCol md="10">
                <CustomSelect
                  choices={categories}
                  label={"Category"}
                  preValue={form?.category || selected.category}
                  onChange={(value) => setForm({ ...form, category: value })}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-5">
              <MDBCol
                md="3"
                className="d-flex justify-content-end align-items-center"
              >
                <h6>* This Product is Per Kilo?</h6>
              </MDBCol>
              <MDBCol md="9">
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
                <h6>* Material</h6>
              </MDBCol>
              <MDBCol md="10">
                <CustomSelect
                  choices={materials}
                  label={"Material"}
                  preValue={form.material || selected.material}
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
