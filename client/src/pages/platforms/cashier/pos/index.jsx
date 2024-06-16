import React, { useEffect, useState } from "react";
import "./pos.css";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBCardImage,
  MDBIcon,
} from "mdbreact";
import { ENDPOINT } from "../../../../services/utilities";
import { categories } from "../../../../services/fakeDb";
import Orders from "./orders";
const POS = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [products, setProducts] = useState([]),
    [search, setSearch] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SELLING_PRODUCTS({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    if (auth._id) {
      dispatch(BROWSECART({ token, key: { _id: auth._id } }));
    }
  }, [dispatch, token, auth]);

  useEffect(() => {
    setCart(cartCollections);
  }, [cartCollections]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MDBContainer
      fluid
      className="pt-3"
      style={{ overflowX: "hidden", height: "100vh" }}
    >
      <MDBRow>
        <MDBCard className="w-100 mb-2">
          <MDBCardHeader className="d-flex align-items-center justify-content-between ">
            <h5 className="font-weight-bold">Liberty Hardware </h5>
            <div className="d-flex align-items-center">
              <MDBIcon
                icon="american-sign-language-interpreting"
                size="2x"
                className="mr-3"
                style={{ color: "#4285F4" }}
              />
              <h5>Transactions</h5>
            </div>
            <h5>Ric Darrel Pajarillaga</h5>
          </MDBCardHeader>
        </MDBCard>
      </MDBRow>
      <MDBRow>
        <MDBCol md="7">
          <MDBCard className="mb-3">
            <MDBCardBody className="m-0 p-1">
              <div className="m-2  search-container">
                <input
                  className="form-control search-input"
                  placeholder="Seach.."
                />
                <MDBBtn
                  size="sm"
                  color="primary"
                  rounded
                  className="search-btn"
                >
                  <MDBIcon icon="search" />
                </MDBBtn>
                <div className="scrollable-buttons m-0 mt-2 p-0">
                  <MDBBtn size="sm" color="primary">
                    All
                  </MDBBtn>
                  {categories.map((category, index) => (
                    <MDBBtn
                      key={index}
                      size="sm"
                      outline
                      color="primary"
                      className="category-btn"
                    >
                      {category}
                    </MDBBtn>
                  ))}
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
          <div className="product-container">
            <MDBRow>
              {filteredProducts.slice(0, 12).map((product, index) => {
                const {
                  variations = [],
                  hasVariant,
                  has2Variant,
                  srp,
                } = product;

                const showPrice = hasVariant
                  ? has2Variant
                    ? variations[0]?.options[0].prices[0]?.srp
                    : variations[0]?.options[0].srp
                  : srp;
                return (
                  <MDBCol key={index} md="3" className="mt-1">
                    <MDBCard className="h-100">
                      <MDBCardImage
                        top
                        waves
                        className=" mx-auto "
                        src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                        style={{ height: "100px", width: "100px" }}
                      />
                      <MDBCardBody className="d-flex flex-column justify-content-between">
                        <h6 className="text-truncate font-weight-bold">
                          {product.name}
                        </h6>
                        <p className="text-truncate text-danger">
                          ₱ {showPrice}
                        </p>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                );
              })}
            </MDBRow>
          </div>
        </MDBCol>
        <MDBCol md="5">
          <Orders orders={cart} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default POS;
