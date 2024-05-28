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
  MDBTable,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../../../../services/utilities";
import {
  BROWSE,
  DESTROY,
} from "../../../../services/redux/slices/administrator/products";
import { Pagination } from "./pagination";
import { Header } from "./header";
import Swal from "sweetalert2";
import Modal from "./modal";
import ProductInformation from "../../../../components/product/index";
import View from "./view";
import "./product.css";

const Products = () => {
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

  const toggle = () => setShow(!show);
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

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
        Swal.fire({
          title: "Deleted!",
          text: "Your Product has been deleted.",
          icon: "success",
        });
      }
    });
  };

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
              <MDBTable striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Variation</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const { name, hasVariation } = product;
                    return (
                      <tr key={index}>
                        <td>{index + 1} </td>
                        <td>{name} </td>
                      </tr>
                    );
                  })}
                </tbody>
              </MDBTable>
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

export default Products;
