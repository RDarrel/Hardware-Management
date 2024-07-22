import React, { useEffect, useState, useRef } from "react";
import "./pos.css";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "./header";
import Cart from "../../../widgets/cart";
import TopProducts from "./topProducts";
import BreadCrumb from "./breadcrumb";
import Categories from "./categories";
import DailyDiscover from "./dailyDiscover";
import ViewSelected from "./viewSelected";
import ProductsCard from "./card";
import productOrder from "../../../../services/utilities/product";
import { customSort } from "../../../../services/utilities";

const Quotation = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [products, setProducts] = useState([]),
    [showSideBar, setShowSideBar] = useState(false),
    [sideBarActive, setSideBarActive] = useState(""),
    [selected, setSelected] = useState({ name: "", media: {} }),
    [productsTemplate, setProductsTemplate] = useState([]),
    [activeCategory, setActiveCategory] = useState(""),
    [isShowCart, setIsShowCart] = useState(false),
    [hasSelect, setHasSelect] = useState(false),
    dispatch = useDispatch();

  const topRef = useRef(null);

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
    const productsWithDefaultSrp = collections.map((product) => {
      const { variations = [], hasVariant, has2Variant, srp } = product;

      const defaultSrp = hasVariant
        ? has2Variant
          ? variations[0]?.options[0]?.prices[0]?.srp
          : variations[0]?.options[0]?.srp
        : srp;

      return {
        ...product,
        defaultSrp: defaultSrp || srp,
      };
    });

    const sorted = [...productsWithDefaultSrp].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    setProductsTemplate(productsWithDefaultSrp);
    setProducts(sorted);
  }, [collections]);

  useEffect(() => {
    if (cartCollections.length > 0 && collections.length > 0) {
      const _carts = cartCollections.map((cart) => {
        const { product, variant1, variant2 } = cart;

        const productWithMax = collections.find(
          ({ _id }) => _id === product._id
        );
        return {
          ...cart,
          product: productWithMax,
          max: productOrder.getMax({
            product: productWithMax,
            variant1,
            variant2,
          }),
        };
      });
      setCart(_carts);
    }
  }, [cartCollections, collections]);

  useEffect(() => {
    if (hasSelect) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
      setHasSelect(false);
    }
  }, [hasSelect]);

  const handleSelectProduct = (product) => {
    const productsInActiveCateg = productsTemplate
      .filter(({ category }) => category._id === product.category?._id)
      .map(({ _id }) => _id);

    const sortedProducts = customSort(productsInActiveCateg, productsTemplate);
    setProducts(sortedProducts);
    setSelected(product);
    setHasSelect(true);
    setShowSideBar(false);
    setActiveCategory(product.category);
    setSideBarActive("");
  };
  const handleSideBar = (active) => {
    if (active === "home") {
      setActiveCategory("");
      setSelected({});
      setShowSideBar(false);
    } else if (active === "all") {
      setActiveCategory("");
      setSideBarActive(active);
      setShowSideBar(true);
    } else {
      setSideBarActive(active);
      setShowSideBar(true);
    }
  };

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} className="100vh">
      <div ref={topRef}></div>
      <Header cart={cart} setIsShowCart={setIsShowCart} />

      {selected._id ? (
        <div className="container-view-selected">
          <BreadCrumb
            selected={selected}
            handleSideBar={handleSideBar}
            sideBarActive={sideBarActive}
            activeCategory={activeCategory}
          />
          {!showSideBar && <ViewSelected selected={selected} />}
        </div>
      ) : (
        <>
          <Categories products={productsTemplate} />
          <TopProducts products={productsTemplate} />
          <DailyDiscover />
        </>
      )}
      <ProductsCard
        showSideBar={showSideBar}
        products={products}
        activeCategory={activeCategory._id}
        setActiveCategory={setActiveCategory}
        setProducts={setProducts}
        selected={selected}
        handleSelectProduct={handleSelectProduct}
        productsTemplate={productsTemplate}
        setProductsTemplate={setProductsTemplate}
      />

      <Cart
        toggle={toggleCart}
        collections={cart}
        show={isShowCart}
        isCustomer={true}
      />
    </div>
  );
};

export default Quotation;
