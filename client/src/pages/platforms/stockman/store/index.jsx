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
import { Pagination } from "./pagination";
import { Header } from "./header";
import Modal from "./modal";
import View from "./view/index";
import "./product.css";
import { ProducCard } from "./card";
import Cart from "./cart";

const Store = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [isView, setIsView] = useState(false),
    [isShowCart, setIsShowCart] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage] = useState(12), // Adjust the number of items per page as needed
    dispatch = useDispatch();

  const toggleView = () => setIsView(!isView);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

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
          <Header setShow={setShow} />
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
            <span className="counter">2</span>
          </>
        )}
      </div>
      <View
        isView={isView}
        toggleView={toggleView}
        selected={selected}
        setIsView={setIsView}
      />
      <Modal
        toggle={() => {
          if (!willCreate) {
            setWillCreate(true);
            setSelected({});
          }
          setShow(false);
        }}
        show={show}
        willCreate={willCreate}
        selected={selected}
      />
      <Cart show={isShowCart} toggle={() => setIsShowCart(false)} />
    </>
  );
};

export default Store;
