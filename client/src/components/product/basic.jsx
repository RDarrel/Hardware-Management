import React, { useEffect } from "react";
import { MDBRow, MDBCol, MDBCardBody, MDBCard, MDBInput } from "mdbreact";
import CustomSelect from "../../components/customSelect";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE as BROWSE_CATEGORIES } from "../../services/redux/slices/administrator/productManagement/category";
import { BROWSE as BROWSE_MATERIALS } from "../../services/redux/slices/administrator/productManagement/materials";

function Basic({ form, setForm, selected }) {
  const { token } = useSelector(({ auth }) => auth),
    { collections: Categories } = useSelector(({ category }) => category),
    { collections: Materials } = useSelector(({ materials }) => materials),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE_CATEGORIES({ token }));
    dispatch(BROWSE_MATERIALS({ token }));
  }, [dispatch, token]);
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
                  choices={Categories}
                  label={"Category"}
                  texts="name"
                  values="_id"
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
                  checked={form?.isPerKilo || false}
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

            <MDBRow className="mt-5 d-flex justify-content-start text-start">
              <MDBCol
                md="3"
                className="d-flex justify-content-end align-items-center"
              >
                <h6 className="text-nowrap">
                  * This product have an expiration date?
                </h6>
              </MDBCol>
              <MDBCol md="7">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="yes expiration"
                  checked={form?.hasExpiration || false}
                  onChange={() => setForm({ ...form, hasExpiration: true })}
                />
                <label
                  htmlFor="yes expiration"
                  className="form-check-label mr-2 label-table"
                >
                  Yes
                </label>

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="no expiration"
                  checked={!form.hasExpiration}
                  onChange={() => setForm({ ...form, hasExpiration: false })}
                />
                <label
                  htmlFor="no expiration"
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
                  choices={Materials}
                  values="_id"
                  texts="name"
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
