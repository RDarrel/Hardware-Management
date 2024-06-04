import React from "react";
import "./style.css";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBInputGroup,
} from "mdbreact";
const Checkout = () => {
  return (
    <>
      <div className="d-flex align-items-center ml-3">
        <MDBIcon
          icon="shopping-cart"
          size="3x"
          className="mr-3"
          style={{ color: "red" }}
        />
        <h4
          className="mt-3 font-weight-bold"
          style={{ color: "red", position: "relative" }}
        >
          Products &nbsp;&nbsp;&nbsp;&nbsp;Checkout
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "100%",
              borderLeft: "1px solid black",
            }}
          />
        </h4>
      </div>
      <MDBCard className="mt-3">
        <MDBCardBody className="m-0 p-0">
          <div className="striped-border"></div>
          <div className="m-3">
            <h4>
              Supplier: <strong>Jasper Bote</strong>
            </h4>
            <div className="supplier-content">
              <p>
                Purchase By:&nbsp;
                <strong>Darrel Pajarillaga (+63) 9203552827</strong>
              </p>
            </div>
          </div>
        </MDBCardBody>
      </MDBCard>
      <MDBCard className="mt-3 dotted">
        <MDBCardBody className="m-0 p-0">
          <div className="m-1 p-2">
            <MDBTable>
              <thead>
                <tr>
                  <th>Product Ordered</th>
                  <th>Unit Price</th>
                  <th>Quantity/Kilo</th>
                  <th>
                    <div className="text-end d-flex justify-content-end mr-2">
                      Item Subtotal
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-weight-bold">
                    HINGE HAUSMANN HI 63X44X1.1MM NARRO...
                  </td>
                  <td>
                    <MDBInputGroup prepend="₱" style={{ width: "200px" }} />
                  </td>
                  <td className="font-weight-bold"> 10</td>

                  <td className="font-weight-bold d-flex justify-content-end mr-2">
                    ₱250
                  </td>
                </tr>
                <tr>
                  <td className="font-weight-bold">
                    HINGE HAUSMANN HI 63X44X1.1MM NARRO...
                  </td>
                  <td>
                    <MDBInputGroup
                      prepend="₱"
                      type="number"
                      style={{ width: "200px" }}
                    />
                  </td>
                  <td className="font-weight-bold"> 5 Kilo and 1/4</td>

                  <td className="font-weight-bold d-flex justify-content-end mr-2">
                    ₱250
                  </td>
                </tr>
                <tr>
                  <td className="font-weight-bold">
                    HINGE HAUSMANN HI 63X44X1.1MM NARRO...
                  </td>
                  <td>
                    <MDBInputGroup prepend="₱" style={{ width: "200px" }} />
                  </td>
                  <td className="font-weight-bold"> 300</td>

                  <td className="font-weight-bold d-flex justify-content-end mr-2">
                    ₱250
                  </td>
                </tr>
                <tr>
                  <td className="font-weight-bold">
                    HINGE HAUSMANN HI 63X44X1.1MM NARRO...
                  </td>
                  <td>
                    <MDBInputGroup prepend="₱" style={{ width: "200px" }} />
                  </td>
                  <td className="font-weight-bold"> 2 Kilo and 1/4</td>

                  <td className="font-weight-bold d-flex justify-content-end mr-2">
                    ₱250
                  </td>
                </tr>
              </tbody>
            </MDBTable>
          </div>
          <hr className="dotted" />
          <MDBRow className="mr-2">
            <MDBCol md="12" className="text-right">
              <h4 className="text-danger">
                Order Total (1 Item):<strong> ₱267</strong>
              </h4>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-3 mr-2 mb-3">
            <MDBCol md="12" className="text-right">
              <MDBBtn color="danger">Buy Now</MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Checkout;
