import React, { useEffect, useState } from "react";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import { MDBCol, MDBRow, MDBContainer } from "mdbreact";
import "./pos.css";
import Orders from "./orders";
import Modal from "./modal";
import { Products } from "./products";
import Search from "./search";
import Header from "./header";
import { useToasts } from "react-toast-notifications";
const POS = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [orders, setOrders] = useState([]),
    [selectedProduct, setSelectedProduct] = useState({}),
    [products, setProducts] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [invoice_no, setInvoice_no] = useState(""),
    [search, setSearch] = useState(""),
    [showVariant, setShowVariant] = useState(false),
    { addToast } = useToasts(),
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
    setProducts(collections);
  }, [collections]);

  const handleSearch = (event) => {
    event.preventDefault();

    const results = collections.filter((product) =>
      product.name.toLowerCase().includes(search.toLocaleLowerCase())
    );

    if (results.length === 0) {
      addToast(`No results Found for ${search}`, {
        appearance: "error",
      });
      setProducts(collections);
    } else if (results.length > 1) {
      setProducts(results);
    } else {
      const product = results[0];

      if (product.hasVariant) {
        setShowVariant(true);
        setSelectedProduct(results[0]);
      } else {
        handleAddOrder(product);
      }
    }

    if (search) {
      setDidSearch(true);
    }
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
      const timestamp = Date.now(); // Get the current timestamp
      const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
      const _invoice_no = `${timestamp}${randomNum}`;

      if (!invoice_no) {
        setInvoice_no(_invoice_no);
      }

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

  return (
    <MDBContainer
      fluid
      className="pt-3"
      style={{ overflowX: "hidden", height: "100vh" }}
    >
      <Header />
      <MDBRow>
        <MDBCol md="7">
          <Search
            didSearch={didSearch}
            handleSearch={handleSearch}
            setDidSearch={setDidSearch}
            search={search}
            setSearch={setSearch}
            setProducts={setProducts}
            collections={collections}
          />
          <Products
            products={products}
            handleAddOrder={handleAddOrder}
            setShowVariant={setShowVariant}
            setSelectedProduct={setSelectedProduct}
          />
        </MDBCol>
        <Orders orders={orders} setOrders={setOrders} invoice_no={invoice_no} />
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
