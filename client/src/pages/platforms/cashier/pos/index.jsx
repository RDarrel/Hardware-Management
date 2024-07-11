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
import Swal from "sweetalert2";
import { variation } from "../../../../services/utilities";
import seperateKiloAndGrams from "../../../../services/utilities/seperateKiloAndGrams";

const POS = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [orders, setOrders] = useState([]),
    [selectedProduct, setSelectedProduct] = useState({}),
    [products, setProducts] = useState([]),
    [isShowAddedToCart, setIsShowAddedToCart] = useState(true),
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

  const handleMaxSaleMessage = (max, isPerKilo = false) => {
    const message = variation.qtyOrKilo(
      {
        ...(isPerKilo ? { ...seperateKiloAndGrams(max) } : { quantity: max }),
      },
      isPerKilo
    );
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: `The maximum kilo/quantity you can sell for this product is ${message}.`,
    });
    setIsShowAddedToCart(true);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const results = collections.filter((product) =>
      product.name
        .toLowerCase()
        .replace(/\s/g, "")
        .includes(search.toLocaleLowerCase().replace(/\s/g, ""))
    );

    if (results.length === 0) {
      setDidSearch(false);

      addToast(`No results Found for ${search}`, {
        appearance: "error",
      });
      setProducts(collections);
      // } else if (results.length > 1) {
      //   setProducts(results);
    } else if (results.length === 1) {
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

  const handleSwalAddedToCart = () => {
    Swal.fire({
      title: "Successfully added to your order",
      icon: "success",
    });
  };

  const handleGetMax = (selected) => {
    const { product, variant1, variant2 } = selected;
    const { hasVariant, has2Variant, isPerKilo = false } = product;
    var max = 0;
    if (hasVariant) {
      const options = [...product.variations[0].options];
      const optionIndex = options.findIndex(({ _id }) => _id === variant1);
      max = options[optionIndex].max;

      if (has2Variant) {
        max = options[optionIndex].prices.find(
          ({ _id }) => _id === variant2
        )?.max;
      }
    } else {
      max = product.max;
    }
    return {
      ...selected,
      max,
      ...(isPerKilo
        ? max >= 1
          ? { kilo: 1 }
          : { kiloGrams: max, kilo: 0 }
        : { quantity: 1 }),
    };
  };

  const handleAddOrder = (product) => {
    setDidSearch(false);
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
      const max = _orders[index].max;

      if (product.isPerKilo) {
        const kilo = _orders[index].kilo + 1;
        if (kilo > max) {
          setIsShowAddedToCart(false);
          return handleMaxSaleMessage(max, true);
        }
        _orders[index].kilo = kilo;
      } else {
        const quantity = _orders[index].quantity + 1;
        if (quantity > max) {
          setIsShowAddedToCart(false);
          return handleMaxSaleMessage(max, false);
        }
        _orders[index].quantity = quantity;
      }
      setOrders(_orders);
    } else {
      const timestamp = Date.now(); // Get the current timestamp
      const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
      const _invoice_no = `${timestamp}${randomNum}`;

      if (!invoice_no) {
        setInvoice_no(_invoice_no);
      }
      const newOrder = {
        product,
        ...(product.isPerKilo ? { kilo: 1 } : { quantity: 1 }),
        ...(product.hasVariant && product.has2Variant
          ? { variant1: product.variant1, variant2: product.variant2 }
          : { variant1: product.variant1 }),
      };

      const newOrderWithMax = handleGetMax(newOrder);

      setOrders((prev) => [{ ...newOrderWithMax }, ...prev]);
    }

    if (showVariant && isShowAddedToCart) {
      handleSwalAddedToCart();
    }
  };
  return (
    <MDBContainer
      fluid
      className="pt-2"
      style={{ overflowY: "hidden", height: "100vh" }}
    >
      <Header />
      <MDBRow>
        <MDBCol md="6">
          <Search
            didSearch={didSearch}
            handleSearch={handleSearch}
            setDidSearch={setDidSearch}
            handleAddOrder={handleAddOrder}
            search={search}
            setSearch={setSearch}
            setProducts={setProducts}
            collections={collections}
            products={products}
          />
          <Products
            products={products}
            handleAddOrder={handleAddOrder}
            setShowVariant={setShowVariant}
            setSelectedProduct={setSelectedProduct}
          />
        </MDBCol>
        <Orders
          orders={orders}
          collections={collections}
          handleMaxSaleMessage={handleMaxSaleMessage}
          setOrders={setOrders}
          invoice_no={invoice_no}
          setInvoice_no={setInvoice_no}
        />
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
