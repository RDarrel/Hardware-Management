import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBBtn,
} from "mdbreact";
import { ENDPOINT, variation } from "../../../../../services/utilities";
const Cart = ({ id, setIsShowCart, setID, cart }) => {
  return (
    <div onMouseLeave={() => setID((prev) => prev + 1)} className="p-2 ">
      <MDBPopover placement="bottom" popover id={`popover-${id}`} key={id}>
        <MDBBtn
          className="d-flex align-items-center cart-pop-over-btn mr-2"
          size="sm"
          onClick={() => setIsShowCart(true)}
          id={`btn-pop-over-${id}`}
        >
          <MDBIcon
            icon="shopping-cart"
            size="2x"
            style={{ color: "white" }}
            className="mr-3 ml-3 cursor-pointer"
          />
          <span className="counter mt-3">
            {cart.length > 0 ? cart.length : 0}
          </span>
        </MDBBtn>
        <MDBPopoverBody className="cart-popover-body" id={`pop-body-${id}`}>
          {cart.slice(0, 5).map((obj, index) => {
            const { product } = obj;
            const { media } = product;
            return (
              <MDBRow
                key={index}
                className={`d-flex align-items-center  ${index > 0 && "mt-4"}`}
              >
                <MDBCol className="d-flex align-items-center" md="10">
                  <div className="d-flex align-items-center">
                    <img
                      src={`${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`}
                      alt={product.name}
                      className="product-image mr-2"
                    />
                    <div>
                      <h6
                        style={{
                          maxWidth: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        className="font-weight-bold ml-2 text-dark"
                      >
                        {product.name}
                      </h6>
                      {product.hasVariant && (
                        <div
                          className="d-flex align-items-center ml-2"
                          style={{ marginTop: "-10px" }}
                        >
                          <span className="mr-1">Variant:</span>
                          <span>{variation.name(obj, product.variations)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md="2">
                  <h6 className="text-danger text-nowrap">
                    ₱
                    {variation
                      .getTheSubTotal("srp", obj, product)
                      .toLocaleString()}
                  </h6>
                </MDBCol>
              </MDBRow>
            );
          })}
          <MDBRow className="d-flex align-items-center mt-4">
            <MDBCol md="6">
              <h6>{cart.length} Products In Cart </h6>
            </MDBCol>
            <MDBCol md="6" className="d-flex justify-content-end">
              <MDBBtn
                size="sm"
                className="p-2"
                color="danger"
                onClick={() => setIsShowCart(true)}
              >
                View My Shopping Cart
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBPopoverBody>
      </MDBPopover>
    </div>
  );
};

export default Cart;
