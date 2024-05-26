import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBView,
} from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/administrator/products";
import Modal from "./modal";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT } from "../../../../services/utilities";
import View from "./view";
import CustomSelect from "../../../../components/customSelect";
import { categories } from "../../../../services/fakeDb";
const Products = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [isView, setIsView] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);
  const toggleView = () => setIsView(!isView);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-0 p-1">
        <h5>Product List</h5>
        <div className="m-0 p-0">
          <select className="form-control">
            {categories.map((categorie, index) => (
              <option value={categorie} key={index}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex align-items-center">
          <input
            style={{ borderRadius: "10px" }}
            className="form-control"
            placeholder="Search.."
          />
          <MDBBtn
            size="sm"
            rounded
            className="d-inline ml-2 px-2 m-0"
            color="primary"
          >
            <MDBIcon icon="search" size="lg" />
          </MDBBtn>
          <MDBBtn
            size="sm"
            rounded
            className="d-inline ml-2 px-2"
            color="primary"
            onClick={() => setShow(true)}
          >
            <MDBIcon icon="plus" size="lg" />
          </MDBBtn>
        </div>
      </div>
      <MDBRow>
        {products.length > 0 &&
          products.map((product, index) => (
            <MDBCol md="3" className="mt-4" key={index}>
              <section>
                <MDBCard>
                  <div className="d-flex justify-content-center">
                    <MDBCardImage
                      className="img-fluid d-flex justify-content-center"
                      src={`${ENDPOINT}/assets/products/${product.name}-${product._id}.jpg`}
                      style={{ height: "250px" }}
                    />
                  </div>
                  <MDBBtn
                    floating
                    tag="a"
                    className="ml-auto mr-4 lighten-3 mdb-color"
                    onClick={() => {
                      setIsView(true);
                      setSelected(product);
                    }}
                    action
                  >
                    <MDBIcon icon="eye" />
                  </MDBBtn>

                  <MDBCardBody>
                    <MDBCardTitle>{product.name}</MDBCardTitle>
                    <hr />
                    <MDBRow>
                      <MDBCol md="12" className="d-flex justify-content-end">
                        <MDBBtnGroup>
                          <MDBBtn
                            size="sm"
                            color="primary"
                            onClick={() => {
                              setWillCreate(false);
                              setSelected(product);
                              toggle();
                            }}
                          >
                            <MDBIcon icon="pencil-alt" />
                          </MDBBtn>
                          <MDBBtn size="sm" color="danger">
                            <MDBIcon icon="trash" />
                          </MDBBtn>
                        </MDBBtnGroup>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </section>
            </MDBCol>
          ))}
      </MDBRow>
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
  );
};

export default Products;
