import React, { useState } from "react";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import {
  formattedDate,
  fullName,
  handlePagination,
  variation,
} from "../../../../../services/utilities";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import Modal from "../modal";
import Received from "./Received";
import GET from "../../GET";
import PendingOrders from "../../../../../services/utilities/downloadExcel/pendingOrders";
import productOrder from "../../../../../services/utilities/product";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

const Table = ({ stockmans = [], isAdmin, isReceived }) => {
  const [show, setShow] = useState(false),
    [viewReceived, setViewRecieved] = useState(false),
    [merchandises, setMerchandises] = useState([]),
    [purchase, setPurchase] = useState({}),
    [page, setPage] = useState(1),
    maxPage = 5;

  stockmans =
    !!stockmans &&
    stockmans.sort((a, b) => {
      const dateA = new Date(isReceived ? a?.received : a?.expectedDelivered);
      const dateB = new Date(isReceived ? b?.received : b?.expectedDelivered);
      return dateB - dateA; // Descending order
    });
  const toggle = () => setShow(!show);

  const toggleReceived = () => setViewRecieved(!viewReceived);

  const handleViewProducts = (_purchase, products = []) => {
    const _products = [...products];
    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    const productsWithExpiration = _products.map((p) => ({
      ...p, // Spread existing properties of each product
      ...(p.product?.hasExpiration && { expiration: expirationDate }), // Add expiration date if hasExpiration is true
    }));
    const baseMerchandises = isReceived ? _products : productsWithExpiration;
    const sortedMerchandises = baseMerchandises.sort(
      (a, b) => b.product?.hasExpiration - a.product?.hasExpiration
    );
    setMerchandises(sortedMerchandises);
    setPurchase(_purchase);
    if (isReceived) {
      toggleReceived();
    } else {
      toggle();
    }
  };

  const hasBordered = isAdmin && isReceived;

  const getQtyKiloText = (key, merchandise) => {
    const {
      kilo = {
        approved: 0,
      },
      kiloGrams = {
        approved: 0,
      },
      quantity = {
        approved: 0,
      },
      product,
    } = merchandise;
    return variation.qtyOrKilo(
      {
        ...merchandise,
        kilo: kilo[key],
        kiloGrams: kiloGrams[key],
        quantity: quantity[key],
      },
      product.isPerKilo
    );
  };

  const textOfDefecAndDisc = (total, isPerKilo) => {
    return isPerKilo ? productOrder.kiloText(total) : `${total} qty`;
  };

  const getTotalAmount = (purchase, key = "") => {
    return formattedTotal(GET.totalAmount(purchase?.merchandises, key));
  };
  const handleExport = (purchase) => {
    const { total, expectedDelivered, supplier, merchandises } = purchase;
    const products = merchandises.map((merchandise) => {
      const {
        expiration = "",
        product,
        variant1 = "",
        variant2 = "",
        capital = 0,
        kilo = {
          approved: 0,
        },
        kiloGrams = {
          approved: 0,
        },
        quantity = {
          approved: 0,
        },
      } = merchandise;
      const {
        name,
        hasVariant = false,
        variations = [],
        isPerKilo = false,
      } = product;
      const Received = getQtyKiloText("received", merchandise);
      const Approved = getQtyKiloText("approved", merchandise);
      const Defective = getQtyKiloText("defective", merchandise);
      const basePurchase = isPerKilo ? kilo : quantity;
      const nonDefective = basePurchase.received - basePurchase.defective;
      const discrepancy = basePurchase.approved - basePurchase.received;
      return {
        product: {
          hasVariant,
          name: name,
          variant: variation.getTheVariant(variant1, variant2, variations),
        },

        quantity: {
          ...(!isReceived && {
            Request: getQtyKiloText("request", merchandise),
          }),
          Approved,
          ...(isReceived && {
            Received,
            Defective,
            "Non-Defective": textOfDefecAndDisc(nonDefective, isPerKilo),
            Discrepancy: textOfDefecAndDisc(discrepancy, isPerKilo),
          }),
        },
        ...(isAdmin && {
          capital: `₱${formattedTotal(capital)}`,
          subtotal: `₱${formattedTotal(
            productOrder.subtotal({
              ...merchandise,
              kilo: kilo?.approved,
              kiloGrams: kiloGrams?.approved,
              quantity: quantity?.approved,
            })
          )}`,
        }),

        ...(isReceived && {
          "Expiration Date": expiration ? formattedDate(expiration) : "--",
        }),
      };
    });
    const title = isReceived ? "Received" : "Pending";
    const options = {
      sheet: "PO",
      filename: `${title} Orders`,
      title: `${title} Orders`,
      supplier: supplier.company,
      expected: formattedDate(expectedDelivered),
      total: `₱${formattedTotal(total)}`,
      defective: `₱${getTotalAmount(purchase, "defective")}`,
      discrepancy: `₱${getTotalAmount(purchase, "discrepancy")}`,
      received: `₱${formattedTotal(purchase.totalReceived)}`,
      isAdmin,
      isReceived,
      stockman: isReceived ? fullName(purchase.requestBy.fullName) : "",
    };
    PendingOrders({ options, array: products });
  };

  return (
    <>
      <MDBTable responsive hover bordered={hasBordered}>
        <thead>
          <tr>
            <th rowSpan={hasBordered && 2} className="cursor-pointer">
              #&nbsp;
            </th>
            <th className="th-lg text-center" rowSpan={2}>
              {isReceived ? "Received" : "Request"} By
            </th>
            {!isReceived && (
              <>
                <th className="text-center">Approved Date</th>
                <th className="text-center">Expected Delivered Date</th>
                {isAdmin && <th className="text-center">Total Amount</th>}
              </>
            )}
            {isReceived && (
              <>
                <th className="text-center" rowSpan={hasBordered && 2}>
                  Received Date
                </th>
                {isAdmin && (
                  <th className="text-center" colSpan={4}>
                    Total Amount
                  </th>
                )}
              </>
            )}

            <th className="th-lg text-center" rowSpan={hasBordered && 2}>
              Products
            </th>
          </tr>
          {hasBordered && (
            <tr>
              <th className="text-center">Payment </th>
              {isReceived && (
                <>
                  <th className="text-center"> Defective </th>
                  <th className="text-center"> Replenishment </th>
                  <th className="text-center"> Products </th>
                </>
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {!!stockmans &&
            handlePagination(stockmans, page, maxPage).map(
              (stockman, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-center">
                    {fullName(stockman?.requestBy?.fullName)}
                  </td>
                  {!isReceived && (
                    <>
                      <td className="text-center">
                        {formattedDate(stockman?.approved)}
                      </td>
                      <td className="text-center">
                        {formattedDate(stockman?.expectedDelivered)}
                      </td>
                    </>
                  )}
                  {isReceived && (
                    <>
                      <td className="text-center">
                        {formattedDate(stockman?.received)}
                      </td>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <td className="font-weight-bolder text-danger text-center">
                        ₱ {stockman.total.toLocaleString()}
                      </td>
                      {isReceived && (
                        <>
                          <td className="font-weight-bolder text-danger text-center">
                            ₱{" "}
                            {GET.totalAmount(
                              stockman.merchandises,
                              "defective"
                            ).toLocaleString()}
                          </td>
                          <td className="font-weight-bolder text-danger text-center">
                            ₱{" "}
                            {GET.totalAmount(
                              stockman.merchandises,
                              "discrepancy"
                            ).toLocaleString()}
                          </td>
                          <td className="font-weight-bolder text-danger text-center">
                            ₱ {stockman.totalReceived?.toLocaleString()}
                          </td>
                        </>
                      )}
                    </>
                  )}
                  <td className="text-center">
                    <MDBBtn
                      color="success"
                      size="sm"
                      floating
                      onClick={() =>
                        handleViewProducts(stockman, stockman.merchandises)
                      }
                    >
                      <MDBIcon icon="shopping-cart" />
                    </MDBBtn>
                    <span className="counter mb-0">
                      {stockman?.merchandises?.length}
                    </span>
                  </td>
                  {/* {!isReceived && ( */}
                  <td>
                    <MDBBtn
                      color="info"
                      size="sm"
                      title="Export to excel"
                      onClick={() => handleExport(stockman)}
                    >
                      <MDBIcon icon="file-excel" />
                    </MDBBtn>
                  </td>
                  {/* )} */}
                </tr>
              )
            )}
        </tbody>
      </MDBTable>
      <PaginationButtons
        title={"Receive"}
        mt={"0"}
        array={stockmans}
        page={page}
        setPage={setPage}
        max={maxPage}
      />
      <Received
        show={viewReceived}
        toggle={toggleReceived}
        isAdmin={isAdmin}
        purchase={purchase}
        merchandises={merchandises}
      />
      <Modal
        isApproved={true}
        hasBorder={true}
        isAdmin={isAdmin}
        merchandises={merchandises}
        setMerchandises={setMerchandises}
        purchase={purchase}
        show={show}
        toggle={toggle}
      />
    </>
  );
};

export default Table;
