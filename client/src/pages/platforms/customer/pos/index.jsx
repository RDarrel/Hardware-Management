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
import sortBy from "../../../../services/utilities/sorting";

const Quotation = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [products, setProducts] = useState([]),
    [topProducts, setTopProducts] = useState([]),
    [showSideBar, setShowSideBar] = useState(false),
    [sideBarActive, setSideBarActive] = useState(""),
    [searchValue, setSearchValue] = useState(""),
    [selected, setSelected] = useState({ name: "", media: {} }),
    [didSearch, setDidSearch] = useState(false),
    [productsTemplate, setProductsTemplate] = useState([]),
    [activeCategory, setActiveCategory] = useState({}),
    [inSearchFilter, setInSearchFilter] = useState(false),
    [isShowCart, setIsShowCart] = useState(false),
    [searchResults, setSearchResults] = useState([]),
    [hasMovingUp, setHasMovingUp] = useState(false),
    [notFound, setNotFound] = useState(false),
    [isResetFiltering, setIsResetFiltering] = useState(false),
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

    setProductsTemplate(productsWithDefaultSrp);
    setProducts(sortBy.shuffle(productsWithDefaultSrp));
    setTopProducts(collections.slice(0, 18));
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
    } else {
      setCart([]);
    }
  }, [cartCollections, collections]);

  useEffect(() => {
    if (hasMovingUp) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
      setHasMovingUp(false);
    }
  }, [hasMovingUp]);

  const handleSelectProduct = (product) => {
    const productsInActiveCateg = productsTemplate
      .filter(({ category }) => category._id === product.category?._id)
      .map(({ _id }) => _id);

    const sortedProducts = customSort(productsInActiveCateg, productsTemplate);
    setProducts(sortedProducts);
    setProductsTemplate((prev) => [...sortBy.shuffle(prev)]);
    setSelected(product);
    setHasMovingUp(true);
    setShowSideBar(false);
    setActiveCategory(product.category);
    setSideBarActive("");
    setInSearchFilter(false);
    setDidSearch(false);
    setNotFound(false);
  };

  const handleSelectCategory = (category) => {
    setShowSideBar(true);
    setActiveCategory(category);
    setSideBarActive(category.name);
    setSelected({ _id: "1" });
    setHasMovingUp(true);
    setInSearchFilter(true);
  };

  const handleSideBar = (active) => {
    if (active === "home") {
      setActiveCategory("");
      setSelected({});
      setShowSideBar(false);
      setProducts(sortBy.shuffle(productsTemplate));
    } else if (active === "all") {
      setActiveCategory("");
      setSideBarActive(active);
      setShowSideBar(true);
    } else {
      setSideBarActive(active);
      setShowSideBar(true);
    }
  };

  useEffect(() => {
    if (isShowCart || showSideBar) {
      document.body.classList.add("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isShowCart, showSideBar]);

  return (
    <div>
      <div
        style={{
          overflowX: "hidden",
          height: "100vh",
        }}
      >
        <div ref={topRef}></div>
        <Header
          cart={cart}
          setIsShowCart={setIsShowCart}
          activeCategory={activeCategory}
          inSearchFilter={inSearchFilter}
          setDidSearch={setDidSearch}
          productsTemplate={productsTemplate}
          setProducts={setProducts}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setHasMovingUp={setHasMovingUp}
          setActiveCategory={setActiveCategory}
          setInSearchFilter={setInSearchFilter}
          setSelected={setSelected}
          setShowSideBar={setShowSideBar}
          setNotFound={setNotFound}
          setSearchResults={setSearchResults}
        />

        {selected._id && !didSearch ? (
          <div className="container-view-selected">
            <BreadCrumb
              selected={selected}
              handleSideBar={handleSideBar}
              sideBarActive={sideBarActive}
              activeCategory={activeCategory}
            />
            {!showSideBar && !didSearch && <ViewSelected selected={selected} />}
          </div>
        ) : (
          !didSearch &&
          !notFound && (
            <>
              <Categories
                products={collections}
                handleSelectCategory={handleSelectCategory}
                isLoading={isLoading}
              />
              <TopProducts
                products={topProducts}
                isLoading={isLoading}
                handleSelectProduct={handleSelectProduct}
              />
              <DailyDiscover />
            </>
          )
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
          isResetFiltering={isResetFiltering}
          setIsResetFiltering={setIsResetFiltering}
          setInSearchFilter={setInSearchFilter}
          didSearch={didSearch}
          searchValue={searchValue}
          notFound={notFound}
          searchResults={searchResults}
          isLoading={isLoading}
        />
      </div>

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
