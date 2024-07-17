import React, { useEffect } from "react";
import "./print.css";

const items = [
  {
    name: "Wood Planks Wood sdfsd Chain test",
    price: "5,000",
    isPerKilo: true,
    kilo: "10 1/4",
    hasVariant: true,
    variant: "40/20 cm",
    subtotal: "2000",
  },
  {
    name: "Shovel",
    isPerKilo: false,
    price: "100",
    quantity: "1",

    subtotal: "1000",
  },
  {
    name: "Nail (Common) ",
    price: "3000",
    isPerKilo: true,
    kilo: "2 1/4",
    subtotal: "5000",
  },
  {
    name: "Paint David",
    price: "3000",
    isPerKilo: true,
    kilo: "2 1/4",
    hasVariant: true,
    variant: "Red",
    subtotal: "6000",
  },
];

const PrintOut = () => {
  useEffect(() => {
    window.print();
  }, []);
  return (
    <div className="container-receipt mt-1">
      <div className="header">
        <h6 className="store">Liberty Hardware</h6>
        <h6 className="address">Conception Gen. Tinio Nueva Ecija</h6>
      </div>
      <div className="sub-header">
        <h6 className="m-0 p-0">
          Invoice No: <span className="invoice">3835067</span>
        </h6>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="mr-1">Date:</span>
            <span className="font-weight-bold">10/23/2022</span>
          </div>
          <div>
            <span>Time:</span>
            <span className="font-weight-bold time">10:23 Am</span>
          </div>
        </div>
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
        {items.map((item, index) => {
          const { isPerKilo, quantity, kilo, price } = item;
          return (
            <div>
              <div key={index} className="d-flex justify-content-between w-100">
                <div className="receipt-product-container">
                  <span className="text-start item-name">
                    {item.name.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center product-details-receipt">
                <span className={`text-nowrap qty-kilo`}>
                  {isPerKilo ? kilo : quantity}
                </span>
                {item.hasVariant && (
                  <div className="receipt-variant">
                    <span>{item.variant}</span>
                  </div>
                )}
                <span>{price}.00</span>

                <div className="subtotal-receipt d-flex justify-content-end">
                  <span>{item.subtotal}.00</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="d-flex justify-content-end mt-2 mb-2 ">
          <div>
            <span>Total:</span>
            <span className="font-weight-bold ml-4">220.00</span>
          </div>
        </div>
        <div className="footer-receipt">
          <div className="d-flex justify-content-end cash">
            <div>
              <span className="mr-5 font-weight-bold">Cash</span>
              <span className="font-weight-bold ml-4 cash">22000.00</span>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <div>
              <span className="mr-5 font-weight-bold mr-5 change-label ">
                Change
              </span>
              <span className="font-weight-bold  change">220.00</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span>THANKYOU AND COME AGAIN.</span>
        </div>
      </div>
    </div>
  );
};

export default PrintOut;
