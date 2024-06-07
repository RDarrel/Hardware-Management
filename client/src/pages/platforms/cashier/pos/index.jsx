import React, { useEffect, useState } from "react";
import "./style.css";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBIcon,
  MDBRow,
} from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/administrator/products";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../../../../services/utilities";
import Profile from "./profile";

const POS = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [didHoverID, setDidHoverID] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} className="100vh">
      <MDBCard style={{ position: "sticky", top: "0", zIndex: "1000" }}>
        <MDBCardBody className="bg-danger m-0 p-0 ">
          <Profile />

          <MDBRow className="d-flex align-items-center justify-content-center   mb-3">
            <MDBCol md="9">
              <MDBRow className="d-flex align-items-center justify-content-center">
                <MDBCol md="12" className="d-flex align-items-center">
                  <MDBIcon
                    icon="shopping-bag"
                    size="3x"
                    style={{ color: "white" }}
                    className="mr-2"
                  />
                  <h4 className="mt-3 text-white text-nowrap">
                    PERLA'S HARDWARE
                  </h4>
                  <div className="input-container ml-3">
                    <input
                      className="form-controls"
                      style={{ height: "50px" }}
                      placeholder="Search..."
                    />
                    <select className="form-select bg-light">
                      <option>All</option>
                      <option>Hardware Supplies</option>
                      <option>Farnitures</option>
                    </select>
                  </div>
                  <MDBIcon
                    icon="shopping-cart"
                    size="2x"
                    style={{ color: "white" }}
                    className="mr-2 ml-3 cursor-pointer"
                  />
                  <span className="counter mt-3">2</span>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>

      <MDBRow className="mb-5">
        <MDBCol size="12" className=" d-flex justify-content-center">
          <MDBRow className="mt-4 w-75">
            {products.map((product, index) => (
              <MDBCol md="3" className="mt-2 " key={index}>
                <MDBCard
                  onMouseEnter={() => setDidHoverID(index)}
                  onMouseLeave={() => setDidHoverID(-1)}
                  style={{
                    boxShadow: "none",
                    border: `1px solid ${
                      didHoverID === index ? "red" : "lightgray"
                    }`,
                    maxHeight: "300px",
                    height: "250px",
                    transform: didHoverID === index ? "translateY(-8px)" : "",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  className={`h-100 cursor-pointer transition-all z-depth-${
                    didHoverID === index ? "1" : "0"
                  }`}
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
                  <MDBCardBody>
                    <h6 className="mb-4"> {product.name}</h6>
                    <div
                      style={{ position: "absolute", bottom: 0 }}
                      className="mt-5"
                    >
                      <h6 className="text-danger font-weight-bold">₱230</h6>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default POS;
