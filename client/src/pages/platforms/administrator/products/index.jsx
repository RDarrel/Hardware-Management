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
  MDBSwitch,
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
    collections.forEach((element) => {});
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

  const handleRowSpan = (product, variant) => {
    if (variant === "variant2") {
      return product.variations.reduce(
        (total, variation) =>
          total +
          variation.options.length * (variation.options[0].prices?.length || 0),
        0
      );
    }

    return product.variations.reduce(
      (total, variation) => total + variation.options.length,
      0
    );
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
              <table>
                <thead>
                  <tr className="bg-light">
                    <th>#</th>
                    <th className="th-lg">Name</th>
                    <th>Variation</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, indexProduct) =>
                    product?.variations?.length === 2 ? (
                      product.variations.map((variation, indexVariation) =>
                        variation.options.map((option, indexOption) =>
                          option.prices?.map((price, indexPrice) => {
                            const isFirstRow =
                              indexVariation === 0 &&
                              indexOption === 0 &&
                              indexPrice === 0;
                            return (
                              <tr key={price._id}>
                                {isFirstRow ? (
                                  <>
                                    <td
                                      rowSpan={handleRowSpan(
                                        product,
                                        "variant2"
                                      )}
                                    >
                                      {indexProduct + 1}
                                    </td>
                                    <td
                                      rowSpan={handleRowSpan(
                                        product,
                                        "variant2"
                                      )}
                                    >
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={`${ENDPOINT}/assets/products/${product.name}-${product._id}/${product.media?.product[0].label}.jpg`}
                                          alt={product.name}
                                          className="mr-2"
                                          style={{ width: "80px" }}
                                        />
                                        <h5> {product.name}</h5>
                                      </div>
                                    </td>
                                  </>
                                ) : null}
                                <td className="d-flex align-items-center ">
                                  <MDBSwitch
                                    labelLeft=""
                                    labelRight=""
                                    checked={true}
                                  />
                                  <h5> {`${option.name}, ${price.name}`}</h5>
                                </td>
                                <td>
                                  <h5>₱{price.srp}</h5>
                                </td>

                                {isFirstRow && (
                                  <td>
                                    <MDBBtn size="sm" rounded color="danger">
                                      <MDBIcon icon="trash" />
                                    </MDBBtn>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        )
                      )
                    ) : product?.variations?.length === 1 ? (
                      product.variations.map((variation, indexVariation) =>
                        variation.options.map((option, indexOption) => {
                          const isFirstRow =
                            indexVariation === 0 && indexOption === 0;
                          return (
                            <tr key={option._id}>
                              {isFirstRow ? (
                                <>
                                  <td
                                    rowSpan={handleRowSpan(product)}
                                    style={{ border: "none" }}
                                  >
                                    {indexProduct + 1}
                                  </td>
                                  <td
                                    rowSpan={handleRowSpan(product)}
                                    style={{ border: "none" }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={`${ENDPOINT}/assets/products/${product.name}-${product._id}/${product.media?.product[0].label}.jpg`}
                                        alt={product.name}
                                        className="mr-2"
                                        style={{ width: "80px" }}
                                      />
                                      <h5> {product.name}</h5>
                                    </div>
                                  </td>
                                </>
                              ) : null}
                              <td
                                className="d-flex align-items-center m-0 p-0"
                                style={{ verticalAlign: "middle" }}
                              >
                                <MDBSwitch
                                  labelLeft=""
                                  labelRight=""
                                  checked={true}
                                />
                                <h5>{`${option.name}`}</h5>
                              </td>
                              <td>
                                <h5>₱{option.srp}</h5>
                              </td>

                              {isFirstRow && (
                                <td>
                                  <MDBBtn size="sm" rounded color="danger">
                                    <MDBIcon icon="trash" />
                                  </MDBBtn>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )
                    ) : (
                      <tr key={product._id}>
                        <td>{indexProduct + 1}</td>
                        <td>
                          <img
                            src={product.media.product[0].preview}
                            style={{ width: "50px" }}
                            alt={product.name}
                          />
                          <h5>{product.name}</h5>
                        </td>
                        <td>N/A</td>
                        <td className="">
                          <h5>₱{product.price}</h5>
                        </td>
                        <td>
                          <MDBBtn size="sm" rounded color="danger">
                            <MDBIcon icon="trash" />
                          </MDBBtn>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
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
