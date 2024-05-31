import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCol,
  MDBIcon,
  MDBRow,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../../../../services/utilities";
import {
  BROWSE,
  DESTROY,
} from "../../../../services/redux/slices/administrator/products";
import { Pagination } from "./pagination";
import { Header } from "./header";
import Modal from "./modal";
import ProductInformation from "../../../../components/product/index";
import View from "./view";
import "./product.css";

const Store = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [isView, setIsView] = useState(false),
    [selected, setSelected] = useState({}),
    [isViewProductInformation, setIsViewProductInformation] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage] = useState(8), // Adjust the number of items per page as needed
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
      {!isViewProductInformation ? (
        <>
          <MDBCard className="mt-4 p-0">
            <Header
              setShow={setShow}
              setIsViewProductInformation={setIsViewProductInformation}
            />
            <MDBCardBody>
              <MDBRow>
                {currentProducts.length > 0 &&
                  currentProducts.map((product, index) => (
                    <MDBCol md="3" className="mt-4" key={index}>
                      <section>
                        <MDBCard>
                          <div className="d-flex justify-content-center">
                            <MDBCardImage
                              className="img-fluid d-flex justify-content-center"
                              src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                              style={{ height: "200px", width: "100%" }}
                            />
                          </div>
                          <MDBBtn
                            floating
                            color="warning"
                            tag="a"
                            className="ml-auto mr-4  "
                            onClick={() => {
                              setIsView(true);
                              setSelected(product);
                            }}
                            action
                          >
                            <MDBIcon icon="cart-plus" />
                          </MDBBtn>

                          <MDBCardBody>
                            <MDBCardTitle>{product.name}</MDBCardTitle>
                          </MDBCardBody>
                        </MDBCard>
                      </section>
                    </MDBCol>
                  ))}
              </MDBRow>

              <Pagination
                currentPage={currentPage}
                pageNumbers={pageNumbers}
                handlePageChange={handlePageChange}
              />
            </MDBCardBody>
          </MDBCard>

          <View isView={isView} toggleView={toggleView} selected={selected} />
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
        </>
      ) : (
        <ProductInformation
          setIsViewProductInformation={setIsViewProductInformation}
        />
      )}
    </>
  );
};

export default Store;
