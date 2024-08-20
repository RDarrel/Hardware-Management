import React, { useCallback, useEffect, useState } from "react";
import { SELLING_PRODUCTS } from "../../../../services/redux/slices/administrator/productManagement/products";
import { BROWSE as BROWSECART } from "../../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import { MDBCol, MDBRow, MDBContainer } from "mdbreact";
import { variation } from "../../../../services/utilities";
import { Products } from "./products";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import Orders from "./orders";
import Modal from "./modal";
import Search from "./search";
import Header from "./header";
import seperateKiloAndGrams from "../../../../services/utilities/seperateKiloAndGrams";
import "./pos.css";

const POS = ({ isWalkin = false }) => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ products }) => products),
    [orders, setOrders] = useState([]),
    [selectedProduct, setSelectedProduct] = useState({}),
    [products, setProducts] = useState([]),
    [isShowAddedToCart, setIsShowAddedToCart] = useState(true),
    [isCheckOut, setIsCheckOut] = useState(false),
    [isSuspend, setIsSuspend] = useState(false),
    [isQuotation, setIsQuotation] = useState(false),
    [didSearch, setDidSearch] = useState(false),
    [showSuspend, setShowSuspend] = useState(false),
    [showGuide, setShowGuide] = useState(false),
    [showFindTransac, setShowFindTransac] = useState(false),
    [invoice_no, setInvoice_no] = useState(""),
    [showSuggested, setShowSuggested] = useState(true), // suggested search results
    [search, setSearch] = useState(""),
    [customerQuotation, setCustomerQuotation] = useState(""),
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
    if (collections.length > 0) {
      const sortedBySold = collections?.slice().sort((a, b) => b.sold - a.sold);

      setProducts(sortedBySold || []);
    }
  }, [collections]);

  const toggleFindTransac = useCallback(() => {
    setShowFindTransac(!showFindTransac);
  }, [showFindTransac]);

  const toggleSuspended = useCallback(
    (_isQuotation) => {
      setShowSuspend(!showSuspend);
      setIsQuotation(!_isQuotation);
    },
    [showSuspend]
  );

  const toggleGuide = useCallback(() => {
    setShowGuide(!showGuide);
  }, [showGuide]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toUpperCase()) {
        case "F5":
          event.preventDefault();
          break;
        case "F4":
          event.preventDefault();
          break;
        case "9":
          event.preventDefault();
          break;
        default:
          return; // Allow default behavior for other keys
      }

      switch (event.key.toUpperCase()) {
        case "F5":
          if (!showSuspend && !isCheckOut && !isWalkin) {
            toggleFindTransac();
          } else {
            console.log("closing");
          }
          break;
        case "F4":
          if (!showFindTransac && !isCheckOut && !isWalkin) {
            toggleSuspended(true);
          }
          break;
        case "9":
          if (!showFindTransac && !isCheckOut && !showSuspend) {
            toggleGuide();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    toggleFindTransac,
    toggleSuspended,
    toggleGuide,
    showSuspend,
    showFindTransac,
    isCheckOut,
    isWalkin,
  ]);

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
    } else if (results.length > 1) {
      setShowSuggested(false);
      setProducts(results);
    } else if (results.length === 1) {
      const product = results[0];

      if (product.hasVariant) {
        setShowVariant(true);
        setSelectedProduct(results[0]);
      } else {
        handleAddOrder(product);
        setSearch("");
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
    const _orders = [...orders];
    let index = _orders.findIndex((item) => {
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
      // const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
      const _invoice_no = `${timestamp}`;

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

  const [page, setPage] = useState(1);

  return (
    <MDBContainer
      fluid
      className="pt-2"
      style={{ overflowY: "hidden", height: "100vh" }}
    >
      <Header
        setOrders={setOrders}
        setInvoice_no={setInvoice_no}
        products={collections}
        showSuspend={showSuspend}
        showGuide={showGuide}
        showFindTransac={showFindTransac}
        toggleFindTransac={toggleFindTransac}
        toggleSuspended={toggleSuspended}
        toggleGuide={toggleGuide}
        isLoading={isLoading}
        isWalkin={isWalkin}
        isQuotation={isQuotation}
        setCustomerQuotation={setCustomerQuotation}
      />
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
            setPage={setPage}
            isLoading={isLoading}
            showSuggested={showSuggested}
            isCheckOut={isCheckOut}
            setShowSuggested={setShowSuggested}
          />
          <Products
            products={products}
            handleAddOrder={handleAddOrder}
            setShowVariant={setShowVariant}
            setSelectedProduct={setSelectedProduct}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
          />
        </MDBCol>
        <Orders
          orders={orders}
          collections={collections}
          handleMaxSaleMessage={handleMaxSaleMessage}
          setOrders={setOrders}
          isCheckOut={isCheckOut}
          setIsCheckOut={setIsCheckOut}
          invoice_no={invoice_no}
          isSuspend={isSuspend}
          setIsSuspend={setIsSuspend}
          setInvoice_no={setInvoice_no}
          isWalkin={isWalkin}
          customerQuotation={customerQuotation}
          setCustomerQuotation={setCustomerQuotation}
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
