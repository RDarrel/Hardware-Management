import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBRow,
  MDBView,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { SUPPLIERS } from "../../../../services/redux/slices/cart";
import { Pagination } from "./pagination";
import { Header } from "./header";
import { ProducCard } from "./card";
import { globalSearch } from "../../../../services/utilities";
import View from "./view/index";
import "./product.css";
import Cart from "../../../widgets/cart";
import ProductsLoading from "../../../widgets/productsLoading";

const Store = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading = true } = useSelector(({ products }) => products),
    { suppliers: suppliersCollections } = useSelector(({ cart }) => cart),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [suppliers, setSuppliers] = useState([]),
    [products, setProducts] = useState([]),
    [cart, setCart] = useState([]),
    [isView, setIsView] = useState(false),
    [isShowCart, setIsShowCart] = useState(false),
    [selected, setSelected] = useState({}),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage] = useState(12),
    [didSearch, setDidSearch] = useState(false),
    [search, setSearch] = useState(""),
    dispatch = useDispatch();

  const toggleView = () => setIsView(!isView);
  useEffect(() => {
    dispatch(BROWSE({ token, key: { sorted: "true" } }));
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(BROWSECART({ token, key: { _id: auth._id } }));
  }, [token, dispatch, auth]);

  useEffect(() => {
    dispatch(SUPPLIERS({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    setCart(cartCollections);
  }, [cartCollections]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  useEffect(() => {
    setSuppliers(suppliersCollections);
  }, [suppliersCollections]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log(suppliers);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSearch = (e) => {
    e.preventDefault();

    setProducts(globalSearch(collections, search));

    setDidSearch(true);
  };

  return (
    <>
      <MDBCard className="mt-4 p-0 pb-3" narrow>
        <MDBView
          cascade
          className="gradient-card-header blue py-2 mx-4 parent-element"
        >
          <Header
            setProducts={setProducts}
            products={collections}
            setCurrentPage={setCurrentPage}
            search={search}
            didSearch={didSearch}
            setDidSearch={setDidSearch}
            setSearch={setSearch}
            setContainer={setProducts}
            handleSearch={handleSearch}
            collections={collections}
          />
        </MDBView>

        <MDBCardBody>
          {isLoading ? (
            <ProductsLoading />
          ) : (
            <>
              <MDBRow>
                {currentProducts.length > 0 &&
                  currentProducts.map((product, index) => (
                    <ProducCard
                      index={index}
                      product={product}
                      key={index}
                      setIsView={setIsView}
                      setSelected={setSelected}
                    />
                  ))}
              </MDBRow>

              {products.length > 11 && (
                <Pagination
                  currentPage={currentPage}
                  pageNumbers={pageNumbers}
                  handlePageChange={handlePageChange}
                />
              )}
            </>
          )}
        </MDBCardBody>
      </MDBCard>

      <div
        style={{
          position: "sticky",
          marginRight: "-65px",
          float: "right",
          bottom: "100px",
        }}
      >
        {!isLoading && (
          <>
            <MDBBtn floating color="red" onClick={() => setIsShowCart(true)}>
              <MDBIcon icon="shopping-cart" />
            </MDBBtn>
            {cart.length > 0 && <span className="counter">{cart.length}</span>}
          </>
        )}
      </div>
      <View
        isView={isView}
        toggleView={toggleView}
        selected={selected}
        setIsView={setIsView}
        suppliers={suppliers}
      />

      <Cart
        suppliers={suppliersCollections}
        show={isShowCart}
        toggle={() => setIsShowCart(false)}
        collections={cart}
        disabledButtons={true}
      />
    </>
  );
};

export default Store;
