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
import { BROWSE } from "../../../../services/redux/slices/administrator/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { Pagination } from "./pagination";
import { Header } from "./header";
import View from "./view/index";
import "./product.css";
import { ProducCard } from "./card";
import Cart from "../../../widgets/cart";

const Store = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [products, setProducts] = useState([]),
    [cart, setCart] = useState([]),
    [isView, setIsView] = useState(false),
    [isShowCart, setIsShowCart] = useState(false),
    [selected, setSelected] = useState({}),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage] = useState(12), // Adjust the number of items per page as needed
    dispatch = useDispatch();

  const toggleView = () => setIsView(!isView);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(BROWSECART({ token, key: { _id: auth._id } }));
  }, [token, dispatch, auth]);

  useEffect(() => {
    setCart(cartCollections);
  }, [cartCollections]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  return (
    <>
      <MDBCard className="mt-4 p-0 pb-3" narrow>
        <MDBView
          cascade
          className="gradient-card-header blue py-2 mx-4 d-flex justify-content-between align-items-center"
        >
          <Header />
        </MDBView>

        <MDBCardBody>
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

          <Pagination
            currentPage={currentPage}
            pageNumbers={pageNumbers}
            handlePageChange={handlePageChange}
          />
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
      />

      <Cart
        show={isShowCart}
        toggle={() => setIsShowCart(false)}
        collections={cart}
      />
    </>
  );
};

export default Store;
