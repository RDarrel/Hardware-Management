import React, { useEffect, useState } from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBView,
  MDBCardBody,
  MDBInput,
  MDBContainer,
  MDBAvatar,
  MDBBtn,
  MDBProgress,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBSpinner,
} from "mdbreact";
import { PresetImage, isJpegOrJpgFile } from "../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { IMAGE, UPLOAD } from "../../services/redux/slices/auth";
import { UPDATE } from "../../services/redux/slices/auth";
import { useHistory } from "react-router";

export default function Profile() {
  const { auth, progress, image, token, progressBar } = useSelector(
      ({ auth }) => auth
    ),
    [file, setFile] = useState(null),
    [form, setForm] = useState({
      fullName: {
        fname: "",
        mname: "",
        lname: "",
        suffix: "",
      },
      address: {
        street: "",
        barangay: "",
        city: "",
        region: "",
        province: "",
      },
      dob: "",
      mobile: "",
      isMale: false,
      bio: "",
    }),
    { addToast } = useToasts(),
    dispatch = useDispatch(),
    history = useHistory();

  const handleImageChange = e => {
    const file = e.target.files[0];

    if (file && isJpegOrJpgFile(file)) {
      const reader = new FileReader();

      reader.onload = e => {
        const img = new Image();

        img.src = e.target.result;

        img.onload = function () {
          if (this.width <= 100 && this.height <= 100) {
            setFile(file);
            dispatch(
              UPLOAD({
                data: {
                  path: `profile`,
                  base64: reader.result.split(",")[1],
                  name: `${auth.email}.jpg`,
                },
                token,
              })
            );
          } else {
            addToast(
              "Please select an image with dimensions below or equal to 100 pixels.",
              {
                appearance: "warning",
              }
            );
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      addToast(
        "Please select a valid JPG image file with dimensions below or equal to 100 pixels.",
        {
          appearance: "warning",
        }
      );
    }
  };

  useEffect(() => {
    if (file && progressBar === 100) {
      dispatch(IMAGE(URL.createObjectURL(file)));
      setFile(null);
      addToast("Image Updated Successfully.", {
        appearance: "success",
      });
    }
  }, [progressBar, file, dispatch, addToast]);

  useEffect(() => {
    if (auth._id) {
      setTimeout(() => {
        setForm(auth);
      }, 1000);
    }
  }, [auth]);

  const handleSubmit = e => {
    e.preventDefault();

    const _form = { ...form };
    delete _form.role;

    dispatch(
      UPDATE({
        data: _form,
        token,
      })
    );
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleObjChange = (obj, key, value) => {
    const _obj = { ...form[obj] };
    _obj[key] = value.toUpperCase();
    setForm({ ...form, [obj]: _obj });
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol lg="3" className="mb-4">
          <MDBCard narrow>
            <MDBView cascade className="mdb-color lighten-3 card-header">
              <h5 className="mb-0 font-weight-bold text-center text-white">
                Edit Photo
              </h5>
            </MDBView>
            <MDBCardBody className="text-center">
              <MDBAvatar
                tag="img"
                src={image}
                onError={e => (e.target.src = PresetImage(auth.isMale))}
                alt={`preview-${auth._id}`}
                className="z-depth-1 mb-3 mx-auto rounded"
              />

              {progressBar >= 0 && <MDBProgress value={progressBar} animated />}
              <p className="text-muted">
                <small>
                  {progressBar > -1
                    ? "Please wait while we update your profile photo"
                    : "Profile photo will be changed automatically"}
                </small>
              </p>
              <label
                htmlFor="changeImage"
                className="btn btn-info btn-sm btn-rounded"
              >
                Upload New Photo
              </label>
              <input
                id="changeImage"
                onChange={handleImageChange}
                type="file"
                className="d-none"
                accept="image/jpeg, image/jpg"
              />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol lg="9">
          <MDBCard narrow>
            <MDBView cascade className="mdb-color lighten-3 card-header">
              <h5 className="mb-0 font-weight-bold text-center text-white">
                Account Details ({progress.percentage}%)
              </h5>
            </MDBView>

            <MDBCardBody className="text-center">
              {form._id ? (
                <form onSubmit={handleSubmit}>
                  <MDBRow>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.fullName?.fname}
                        onChange={e =>
                          handleObjChange("fullName", "fname", e.target.value)
                        }
                        label="First name"
                        required
                      />
                    </MDBCol>
                    <MDBCol md="2">
                      <MDBInput
                        type="text"
                        value={form.fullName?.mname}
                        onChange={e =>
                          handleObjChange("fullName", "mname", e.target.value)
                        }
                        label="Middle name"
                      />
                    </MDBCol>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.fullName?.lname}
                        onChange={e =>
                          handleObjChange("fullName", "lname", e.target.value)
                        }
                        label="Last name"
                        required
                      />
                    </MDBCol>
                    <MDBCol md="2">
                      <MDBSelect
                        className="colorful-select dropdown-primary hidden-md-down text-left"
                        label="Suffix"
                        getValue={e =>
                          handleObjChange(
                            "fullName",
                            "suffix",
                            e[0] === "N/A" ? "" : e[0]
                          )
                        }
                      >
                        <MDBSelectInput />
                        <MDBSelectOptions>
                          <MDBSelectOption
                            selected={!form.fullName.suffix}
                            value="N/A"
                          >
                            N/A
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={form.fullName.suffix === "JR"}
                            value="JR"
                          >
                            JR
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={form.fullName.suffix === "III"}
                            value="III"
                          >
                            III
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={form.fullName.suffix === "IV"}
                            value="IV"
                          >
                            IV
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={form.fullName.suffix === "V"}
                            value="V"
                          >
                            V
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={form.fullName.suffix === "SR"}
                            value="SR"
                          >
                            SR
                          </MDBSelectOption>
                        </MDBSelectOptions>
                      </MDBSelect>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.address?.region}
                        onChange={e =>
                          handleObjChange("address", "region", e.target.value)
                        }
                        label="Region"
                        required
                      />
                    </MDBCol>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.address?.province}
                        onChange={e =>
                          handleObjChange("address", "province", e.target.value)
                        }
                        label="Province"
                        required
                      />
                    </MDBCol>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.address?.city}
                        onChange={e =>
                          handleObjChange("address", "city", e.target.value)
                        }
                        label="City/Municipality"
                        required
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBInput
                        type="text"
                        value={form.address?.barangay}
                        onChange={e =>
                          handleObjChange("address", "barangay", e.target.value)
                        }
                        label="Barangay"
                      />
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBInput
                        type="text"
                        value={form.address?.street}
                        onChange={e =>
                          handleObjChange("address", "street", e.target.value)
                        }
                        label="Street"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="4">
                      <MDBInput
                        type="date"
                        value={form.dob}
                        onChange={e => handleChange("dob", e.target.value)}
                        required
                        label="Birthdate"
                      />
                    </MDBCol>
                    <MDBCol md="4">
                      <MDBInput
                        type="text"
                        value={form.mobile}
                        onChange={e =>
                          handleChange(
                            "mobile",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        required
                        label="Mobile (+63)"
                        maxLength={10}
                      />
                    </MDBCol>

                    <MDBCol md="4">
                      <MDBSelect
                        className="colorful-select dropdown-primary hidden-md-down text-left"
                        label="Gender"
                        getValue={e => handleChange("isMale", e[0] === "true")}
                      >
                        <MDBSelectInput />
                        <MDBSelectOptions>
                          <MDBSelectOption selected={form.isMale} value="true">
                            Male
                          </MDBSelectOption>
                          <MDBSelectOption
                            selected={!form.isMale}
                            value="false"
                          >
                            Female
                          </MDBSelectOption>
                        </MDBSelectOptions>
                      </MDBSelect>
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    type="textarea"
                    value={form.bio}
                    onChange={e => handleChange("bio", e.target.value)}
                    label="Biography"
                  />
                  <div className="d-flex justify-content-between">
                    <MDBBtn
                      onClick={() => history.push("/profile")}
                      type="button"
                      color="primary"
                      disabled={progress.percentage < 63}
                      rounded
                    >
                      View profile
                    </MDBBtn>
                    <MDBBtn color="info" type="submit" rounded>
                      Update account
                    </MDBBtn>
                  </div>
                </form>
              ) : (
                <MDBSpinner />
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
