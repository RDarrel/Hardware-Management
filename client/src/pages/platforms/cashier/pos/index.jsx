import React, { useEffect, useRef, useState } from "react";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBCardImage,
  MDBIcon,
} from "mdbreact";
import { ENDPOINT } from "../../../../services/utilities";
import "./pos.css";
import Orders from "./orders";
import Categories from "./categories";
import Modal from "./modal";
const POS = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    { collections: cartCollections } = useSelector(({ cart }) => cart),
    [cart, setCart] = useState([]),
    [orders, setOrders] = useState([]),
    [selectedProduct, setSelectedProduct] = useState({}),
    [products, setProducts] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [search, setSearch] = useState(""),
    [showVariant, setShowVariant] = useState(false),
    dispatch = useDispatch();

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

  const handleSearch = (event) => {
    event.preventDefault();

    const results = collections.filter((product) =>
      product.name.toLowerCase().includes(search.toLocaleLowerCase())
    );

    if (results.length > 1) return setProducts(results);

    const product = results[0];

    if (product.hasVariant) {
      setShowVariant(true);
      setSelectedProduct(results[0]);
    } else {
      handleAddOrder(product);
    }
    setDidSearch(true);
    //to check if product is exist in order details
  };

  const handleAddOrder = (product) => {
    let index = orders.findIndex((item) => {
      if (item.product?._id !== product._id) {
        return false;
      }
      if (product.hasVariant) {
        if (product.has2Variant) {
          return (
            item.variant1 === product.variant1 &&
            item.variant2 === product.variant2
          );
        } else {
          return item.variant1 === product.variant1;
        }
      }
      return true; // No variants to compare
    });

    const _orders = [...orders];
    if (index > -1) {
      if (product.isPerKilo) {
        _orders[index].kilo += 1;
      } else {
        _orders[index].quantity += 1;
      }
      setOrders(_orders);
    } else {
      setOrders((prev) => [
        {
          product,
          ...(product.isPerKilo ? { kilo: 1 } : { quantity: 1 }),
          ...(product.hasVariant && product.has2Variant
            ? { variant1: product.variant1, variant2: product.variant2 }
            : { variant1: product.variant1 }),
        },
        ...prev,
      ]);
    }
  };

  const componentRef = useRef(null);
  const [componentHeight, setComponentHeight] = useState(0);

  const updateHeight = () => {
    if (componentRef.current) {
      setComponentHeight(componentRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <MDBContainer
      fluid
      className="pt-3"
      style={{ overflowX: "hidden", height: "100vh" }}
    >
      <MDBRow>
        <MDBCard className="w-100 mb-2">
          <MDBCardHeader className="d-flex align-items-center justify-content-between ">
            <h5 className="font-weight-bold">Liberty Hardware </h5>
            <div className="d-flex align-items-center">
              <MDBIcon
                icon="american-sign-language-interpreting"
                size="2x"
                className="mr-3"
                style={{ color: "#4285F4" }}
              />
              <h5>Transactions</h5>
            </div>
            <h5>Ric Darrel Pajarillaga</h5>
          </MDBCardHeader>
        </MDBCard>
      </MDBRow>
      <MDBRow>
        <MDBCol md="7">
          <MDBCard className="mb-3">
            <MDBCardBody className="m-0 p-1">
              <div className="m-2  search-container">
                <form onSubmit={handleSearch}>
                  <input
                    className="form-control search-input"
                    placeholder="Seach.."
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                    name="search"
                  />
                  <MDBBtn
                    size="sm"
                    color="primary"
                    rounded
                    onClick={() => {
                      if (didSearch) {
                        setDidSearch(false);
                        setProducts(collections);
                      } else {
                        return;
                      }
                    }}
                    type={didSearch ? "button" : "submit"}
                    className="search-btn"
                  >
                    <MDBIcon icon={didSearch ? "times" : "search"} />
                  </MDBBtn>
                </form>
                <Categories />
              </div>
            </MDBCardBody>
          </MDBCard>
          <div
            className="product-container"
            ref={componentRef}
            style={{ maxHeight: componentHeight }}
          >
            <MDBRow>
              {products.slice(0, 12).map((product, index) => {
                const {
                  variations = [],
                  hasVariant,
                  has2Variant,
                  srp,
                } = product;

                const showPrice = hasVariant
                  ? has2Variant
                    ? variations[0]?.options[0].prices[0]?.srp
                    : variations[0]?.options[0].srp
                  : srp;
                return (
                  <MDBCol
                    key={index}
                    md="3"
                    className="mt-1 cursor-pointer"
                    onClick={() => {
                      if (product.hasVariant) {
                        setShowVariant(true);
                        setSelectedProduct(product);
                      } else {
                        handleAddOrder(product);
                      }
                    }}
                  >
                    <MDBCard className="h-100">
                      <MDBCardImage
                        top
                        waves
                        className=" mx-auto "
                        src={`${ENDPOINT}/assets/products/${product._id}/Cover Photo.jpg`}
                        style={{ height: "100px", width: "100px" }}
                      />
                      <MDBCardBody className="d-flex flex-column justify-content-between">
                        <h6 className="text-truncate font-weight-bold">
                          {product.name}
                        </h6>
                        <p className="text-truncate text-danger">
                          ₱ {showPrice}
                        </p>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                );
              })}
            </MDBRow>
          </div>
        </MDBCol>
        <MDBCol md="5">
          <Orders orders={orders} setOrders={setOrders} />
        </MDBCol>
      </MDBRow>
      <Modal
        show={showVariant}
        toggle={() => setShowVariant(!showVariant)}
        selected={selectedProduct}
        handleAddOrder={handleAddOrder}
      />
    </MDBContainer>
  );
};

export default POS;
