import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE,
  UPDATE,
} from "../../../../services/redux/slices/administrator/products";
import CustomSelect from "../../../../components/customSelect";
import { isEqual } from "lodash";
import { categories } from "../../../../services/fakeDb";

const _form = {
  name: "",
  price: "",
  category: 50,
  description: "",
  isPerKilo: false,
  isPerSize: false,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { token } = useSelector(({ auth }) => auth),
    [isShowBtn, setIsShowBtn] = useState(false),
    [preview, setPreview] = useState(""),
    [base64, setBase64] = useState(""),
    [form, setForm] = useState(_form),
    [sizes, setSizes] = useState([{ size: "", price: "" }]),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!willCreate) {
      if (isEqual(form, selected)) {
        addToast("No changes found, skipping update.", {
          appearance: "info",
        });
      } else {
        dispatch(
          UPDATE({
            data: { ...form, sizes, img: base64 },
            token,
          })
        );
      }
    } else {
      dispatch(SAVE({ data: { ...form, sizes, img: base64 }, token }));
    }

    setForm(_form);
    toggle();
  };

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  const handleChangeSizes = (index, event) => {
    const { name, value } = event.target;
    const _sizes = [...sizes];
    if (_sizes[index + 1] === undefined) _sizes.push({ size: "", price: "" });
    _sizes[index] = { ..._sizes[index], [name]: value };

    setSizes(_sizes);
  };

  const handleRemove = (index) => {
    if (index > 0) {
      const _sizes = [...sizes];
      _sizes.splice(index, 1);
      setSizes(_sizes);
    }
  };
  const handleUploadImg = (file) => {
    const reader = new FileReader();

    reader.onload = ({ target }) => {
      const { result } = target;

      const img = new Image();
      img.src = result;

      img.onload = () => {
        const base64String = result.split(",")[1];
        setBase64(base64String);
        setPreview(URL.createObjectURL(file));
      };
    };

    reader.readAsDataURL(file);
  };
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {!willCreate ? "Update" : "Create"} a Product
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow className={preview ? "" : "d-flex align-items-center"}>
            <MDBCol
              className="text-center align-items-center  m-0"
              md="4"
              style={{ position: "relative" }}
            >
              {preview ? (
                <div
                  onMouseEnter={() => setIsShowBtn(true)}
                  onMouseLeave={() => setIsShowBtn(false)}
                  style={{
                    position: "relative",
                    width: "300px",
                    height: "350px",
                  }}
                >
                  <MDBCardImage
                    src={preview}
                    className="mx-2"
                    style={{ width: "100%" }}
                  />
                  {isShowBtn && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MDBBtn
                        color="warning"
                        title="Upload Image"
                        onClick={() =>
                          document.getElementById("upload-img").click()
                        }
                      >
                        <MDBIcon icon="upload" />
                      </MDBBtn>
                    </div>
                  )}
                </div>
              ) : (
                <MDBBtn
                  color="warning"
                  title="Upload Image"
                  onClick={() => document.getElementById("upload-img").click()}
                >
                  <MDBIcon icon="upload" />
                </MDBBtn>
              )}

              <input
                id="upload-img"
                className="d-none"
                onChange={(e) => handleUploadImg(e.target.files[0])}
                type="file"
                accept="image/*"
              />
            </MDBCol>
            <MDBCol md="8">
              <MDBInput
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {!form.isPerSize && (
                <MDBInput
                  label="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              )}
              <CustomSelect
                choices={categories}
                preValue={form.category}
                onChange={(value) => setForm({ ...form, category: value })}
                label={"Category"}
              />

              <MDBInput
                type="textarea"
                label="Description "
                value={form.description}
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <MDBBtn>Variations</MDBBtn>

              {/* <input
                className="form-check-input"
                type="checkbox"
                id={"isSize"}
                checked={form.isPerSize}
                onChange={() =>
                  setForm({ ...form, isPerSize: !form.isPerSize })
                }
              />
              <label
                htmlFor={"isSize"}
                className="form-check-label mr-2 label-table"
              >
                Per size
              </label>

              <input
                className="form-check-input"
                type="checkbox"
                id={"isPerKilo"}
                checked={form.isPerKilo}
                onChange={() =>
                  setForm({ ...form, isPerKilo: !form.isPerKilo })
                }
              />
              <label
                htmlFor={"isPerKilo"}
                className="form-check-label ml-3 label-table"
              >
                Per Kilo
              </label>

              <input
                className="form-check-input"
                type="checkbox"
                id={"color"}
                checked={form.isPerSize}
                onChange={() =>
                  setForm({ ...form, isPerSize: !form.isPerSize })
                }
              />
              <label
                htmlFor={"color"}
                className="form-check-label ml-3 mr-2 label-table"
              >
                Have a multiple color
              </label>

              <input
                className="form-check-input"
                type="checkbox"
                id={"variant"}
                checked={form.isPerKilo}
                onChange={() =>
                  setForm({ ...form, isPerKilo: !form.isPerKilo })
                }
              />
              <label
                htmlFor={"variant"}
                className="form-check-label ml-3 label-table"
              >
                Have a variants
              </label> */}
              {form.isPerSize &&
                sizes.map(({ size, price }, index) => (
                  <MDBRow key={index} className="d-flex align-items-center">
                    <MDBCol>
                      <MDBInput
                        value={size}
                        name="size"
                        label="Size"
                        onChange={(e) => handleChangeSizes(index, e)}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        value={price}
                        label={`${
                          form.isPerKilo
                            ? "Price per (kilo)"
                            : "Price per (qty)"
                        }`}
                        type="number"
                        name="price"
                        onChange={(e) => handleChangeSizes(index, e)}
                      />
                    </MDBCol>
                    <MDBCol md="2">
                      <MDBBtn
                        size="sm"
                        rounded
                        color="danger"
                        onClick={() => handleRemove(index)}
                      >
                        <MDBIcon icon="times" />
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                ))}
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol></MDBCol>
          </MDBRow>

          <div className="text-center mb-1-half">
            <MDBBtn type="submit" color="primary" className="mb-2 float-right">
              {!willCreate ? "Update" : "Submit"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
