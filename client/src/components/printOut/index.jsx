import React, { useEffect, useState, useCallback } from "react";
import "./print.css";
import { MDBCol, MDBRow } from "mdbreact";

const PrintOut = () => {
  const [products, setProducts] = useState([]);
  const [obj, setObj] = useState({});

  const formatterSold = (data, isPerKilo) => {
    const { quantity = 0, kilo = 0, kiloGrams = 0 } = data;

    const getGrams = (grams) => {
      switch (grams) {
        case 0.25:
          return "1/4";
        case 0.5:
          return "1/2";

        default:
          return "3/4";
      }
    };
    if (isPerKilo) {
      if (kilo > 0 && kiloGrams > 0) {
        return { sold: `${kilo} ${getGrams(kiloGrams)}` };
      }

      if (kilo > 0 && kiloGrams === 0) {
        return { sold: kilo };
      }

      if (kilo === 0 && kiloGrams > 0) {
        return { sold: getGrams(kiloGrams) };
      }
    } else {
      return { sold: quantity };
    }
  };

  const formatedData = useCallback((datas) => {
    return datas.map((data) => {
      const { product } = data;
      const { isPerKilo } = product;

      return { ...data, ...formatterSold(data, isPerKilo) };
    });
  }, []);

  useEffect(() => {
    const fakeDb = localStorage.getItem("collection");
    if (!fakeDb) return false;
    const data = JSON.parse(fakeDb);
    setProducts(formatedData(data.purchases));
    setObj(data);
  }, [formatedData]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     window.print();
  //     window.close();
  //   }, 90);

  //   return () => clearTimeout(timer);
  // }, []);

  const getCurrentFormattedDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const getCurrentFormattedTimeAMPM = () => {
    const today = new Date();

    let hours = today.getHours();
    const minutes = String(today.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="container-receipt mt-1">
      <div className="header">
        <h6 className="store">Liberty Hardware</h6>
        <h6 className="address">Conception Gen. Tinio Nueva Ecija</h6>
      </div>
      <div className="sub-header">
        <h6 className="m-0 p-0">
          {obj.isQuotation ? "Quotation" : "Invoice"} No:
          <span className="invoice">{obj?.invoice_no}</span>
        </h6>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="mr-1">Date:</span>
            <span className="font-weight-bold">
              {getCurrentFormattedDate()}
            </span>
          </div>
          <div>
            <span>Time:</span>
            <span className="font-weight-bold time">
              {getCurrentFormattedTimeAMPM()}
            </span>
          </div>
        </div>

        <h6 className={`m-0 p-0  ${obj.customer ? "cashier-name-mb" : ""}`}>
          Cashier:
          <span className="invoice cashier-name"> {obj?.cashier}</span>
        </h6>

        {obj.customer && (
          <h6 className="m-0 p-0 customer-name">
            Customer:
            <span className="invoice"> {obj?.customer}</span>
          </h6>
        )}
      </div>

      <div className="receipt-table">
        <div className="d-flex justify-content-between w-100 receipt-table-header-container mb-1">
          <div className="d-flex justify-content-between w-100 receipt-table-header">
            <span>Item</span>
            <span>Qty/Kilo</span>
            <span>Srp</span>
            <span>Sub-total</span>
          </div>
        </div>
        {products.map((item, index) => {
          const { srp = 0, product, variant = "", sold = 1, subtotal } = item;
          return (
            <div key={index}>
              <div className="d-flex justify-content-between w-100">
                <div className="receipt-product-container">
                  <span className="text-start item-name ">
                    {product.name.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center product-details-receipt">
                <span className={`text-nowrap qty-kilo ml-1`}>{sold}</span>
                {product.hasVariant && (
                  <div className="receipt-variant">
                    <span>{variant}</span>
                  </div>
                )}
                <span className="srp">{srp.toLocaleString()}.00</span>

                <div className="subtotal-receipt d-flex justify-content-end">
                  <span className="subtotal">
                    {subtotal.toLocaleString()}.00
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="d-flex justify-content-between mt-2 ">
          <span>Total:</span>
          <span className="font-weight-bold ml-4">
            {obj.total?.toLocaleString()}.00
          </span>
        </div>
        <div className="d-flex justify-content-between ">
          <span>Total Discount:</span>
          <span className="font-weight-bold ml-4">
            {obj.totalDiscount?.toLocaleString()}.00
          </span>
        </div>
        <div className="d-flex justify-content-between  ">
          <span>Total Amount:</span>
          <span className="font-weight-bold ml-4">
            {(obj.total - obj.totalDiscount).toLocaleString()}.00
          </span>
        </div>
        <div className="d-flex justify-content-between   ">
          <span>Total VAT(12%):</span>
          <span className="font-weight-bold ml-4">
            {obj.totalVat?.toLocaleString()}.00
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Total Due:</span>
          <span className="font-weight-bold ml-4">
            {obj.totalDue?.toLocaleString()}.00
          </span>
        </div>
        {!obj.isQuotation && (
          <div className="footer-receipt">
            <div className="d-flex justify-content-between mt-1">
              <span className="font-weight-bold">Cash:</span>
              <span className="font-weight-bold ml-4">
                {obj.cash?.toLocaleString()}.00
              </span>
            </div>

            <div className="d-flex justify-content-between mb-1">
              <span className="font-weight-bold">Change:</span>
              <span className="font-weight-bold ml-4">
                {Number(obj.cash - obj.totalDue || 0)?.toLocaleString()}.00
              </span>
            </div>
            {/* <MDBRow>
              <MDBCol
                md="5"
                sm="3"
                className="d-flex justify-content-end  cash-label"
              >
                <span className="mr-2 font-weight-bold ">Cash</span>
              </MDBCol>
              <MDBCol className="mr-4  d-flex justify-content-end">
                <span className="font-weight-bold ml-4  mr-3 cash-value">
                  {obj.cash?.toLocaleString()}.00
                </span>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol
                md="5"
                sm="3"
                className="d-flex justify-content-end cash-label"
              >
                <span className="mr-2 font-weight-bold ">Change</span>
              </MDBCol>
              <MDBCol className="mr-4 d-flex justify-content-end">
                <span className="font-weight-bold ml-4  mr-3 cash-value">
                  {Number(obj.cash - obj.totalDue || 0)?.toLocaleString()}.00
                </span>
              </MDBCol>
            </MDBRow> */}
          </div>
        )}
        <div className="text-center d-flex flex-column">
          <small>THIS SERVE AS YOUR</small>
          <small>SALES INVOICE</small>
          <small>THANK YOU AND COME AGAIN.</small>
        </div>
      </div>
    </div>
  );
};

export default PrintOut;
