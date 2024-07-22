import React, { useEffect, useState, useRef } from "react";
import "./pos.css";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import Card from "./card";
import { Header } from "./header";
import Cart from "../../../widgets/cart";
import TopProducts from "./topProducts";
import BreadCrumb from "./breadcrumb";
import Categories from "./categories";
import DailyDiscover from "./dailyDiscover";
import ViewSelected from "./viewSelected";

const Quotation = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [products, setProducts] = useState([]),
    [selected, setSelected] = useState({ name: "", media: {} }),
    [isShowCart, setIsShowCart] = useState(false),
    [isView, setIsView] = useState(false),
    dispatch = useDispatch();

  const topRef = useRef(null);

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

  useEffect(() => {
    if (selected._id) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected]);

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} className="100vh">
      <div ref={topRef}></div>
      <Header cart={cart} setIsShowCart={setIsShowCart} />
      {selected._id ? (
        <div className="container-view-selected">
          <BreadCrumb selected={selected} />
          <ViewSelected selected={selected} />
        </div>
      ) : (
        <>
          <Categories products={products} />
          <TopProducts products={products} />
          <DailyDiscover />
        </>
      )}
      <Card
        products={products}
        selected={selected}
        setSelected={setSelected}
        setIsView={setIsView}
      />
      {/* <ViewProduct
        selected={selected}
        isCashier={true}
        setIsView={setIsView}
        isView={isView}
        toggleView={toggleView}
      /> */}
      <Cart
        toggle={toggleCart}
        collections={cart}
        show={isShowCart}
        isCashier={true}
      />
    </div>
  );
};

export default Quotation;
