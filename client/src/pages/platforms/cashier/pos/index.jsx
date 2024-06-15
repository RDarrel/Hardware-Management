import React, { useEffect, useState } from "react";
import "./pos.css";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import Card from "./card";
import { Header } from "./header";
import ViewProduct from "../../../widgets/viewProduct";
import Cart from "../../../widgets/cart";
import { MDBCard, MDBCardBody, MDBCol, MDBRow } from "mdbreact";

const POS = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [products, setProducts] = useState([]),
    [selected, setSelected] = useState({}),
    [isShowCart, setIsShowCart] = useState(false),
    [isView, setIsView] = useState(false),
    dispatch = useDispatch();

  const toggleView = () => setIsView(!isView);

  const toggleCart = () => setIsShowCart(!isShowCart);

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

  return (
    <>
      <MDBRow>
        <MDBCol md="8">test</MDBCol>
        <MDBCol>
          <h2>Order Details</h2>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default POS;
