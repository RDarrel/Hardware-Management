import React, { useEffect, useState } from "react";
// import {
//   REFUND_PRODUCTS,
//   RETURN_PRODUCTS,
// } from "../../../../../services/redux/slices/cashier/pos";
import { FIND_TRANSACTION } from "../../../../../services/redux/slices/cashier/pos";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBtnGroup,
} from "mdbreact";

import { useDispatch, useSelector } from "react-redux";
import {
  formattedDate,
  transaction as transactionAction,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
import Receipt from "./receipt";
import formattedTotal from "../../../../../services/utilities/forattedTotal";

export default function Transactions({ show, toggle }) {
  const { token } = useSelector(({ auth }) => auth),
    { transaction, findTransacIsLoading = false } = useSelector(
      ({ pos }) => pos
    ),
    [foundTransaction, setFoundTransaction] = useState({}),
    [purchases, setPurchases] = useState([]),
    [search, setSearch] = useState(""),
    [total, setTotal] = useState(0),
    [date, setDate] = useState(""),
    [cash, setCash] = useState(""),
    [invoice_no, setInvoice_no] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    [hasRefund, setHasRefund] = useState(false),
    [showTransac, setShowTransac] = useState(false),
    dispatch = useDispatch();

  const toggleTransac = () => setShowTransac(!showTransac);

  useEffect(() => {
    if (show) {
      setSearch("");
      setFoundTransaction({});
    } else {
      setPurchases([]);
    }
  }, [show]);

  useEffect(() => {
    setHasRefund(transaction.totalRefundSales > 0);
    setFoundTransaction(transaction);
  }, [transaction]);

  useEffect(() => {
    if (didSearch && !findTransacIsLoading) {
      const timer = setTimeout(() => {
        if (!foundTransaction.invoice_no) {
          Swal.fire({
            text: `No Transaction Found for invoice no. ${search}`,
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then(() => setDidSearch(false));
        } else {
          setDidSearch(false);
        }
      }, 400); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [didSearch, foundTransaction, search, setDidSearch, findTransacIsLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(FIND_TRANSACTION({ token, key: { invoice_no: search } }));
    setDidSearch(true);
  };

  const handleClose = () => {
    toggle();
  };

  const handleViewTransaction = (
    orderDetails,
    invoice,
    _date,
    _total,
    _cash
  ) => {
    setPurchases(transactionAction.computeSubtotal(orderDetails));
    setInvoice_no(invoice);
    setDate(_date);
    setTotal(_total);
    setCash(_cash);
    toggleTransac();
  };

  // const handleAction = (isReturn) => {
  //   Swal.fire({
  //     title: `<h5 class='font-weight-bolder'>Kindly provide a reason for ${
  //       isReturn ? "Replacement" : "Refunding"
  //     } the product.</h5>`,
  //     html: `
  //      <div>
  //      <select id="return-reason" class=" text-center w-100 form-control">
  //       <option value="Defective or damaged product">Defective or damaged product</option>
  //       <option value="Wrong item">Wrong item</option>
  //       <option value="Quality issues">Quality issues</option>
  //       <option value="Expired items">Expired items</option>
  //       <option value="Fitment issues">Fitment issues</option>
  //     </select></div>
  //   `,
  //     showCancelButton: true,
  //     cancelButtonText: "Cancel",
  //     confirmButtonText: isReturn ? "Replace" : "Refund",
  //     reverseButtons: true,
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       const textAreaValue = document.getElementById("return-reason").value;
  //       if (!textAreaValue) {
  //         Swal.showValidationMessage("You need to write a reason!");
  //       } else {
  //         return textAreaValue;
  //       }
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const reason = result.value;
  //       if (isReturn) {
  //         dispatch(
  //           RETURN_PRODUCTS({
  //             token,
  //             data: {
  //               invoice_no: transaction.invoice_no,
  //               returnBy: auth._id,
  //               customer: transaction.customer || "",
  //               products: transaction.purchases,
  //               reason,
  //             },
  //           })
  //         );
  //       } else {
  //         dispatch(
  //           REFUND_PRODUCTS({
  //             token,
  //             data: {
  //               customer: transaction.customer || "",
  //               refundAll: true,
  //               invoice_no: transaction.invoice_no,
  //               refundBy: auth._id,
  //               products: transaction.purchases,
  //               reason,
  //             },
  //           })
  //         );

  //         toggle();
  //       }
  //       Swal.fire(
  //         "Successfully!",
  //         `${isReturn ? "Return" : "Refund"}`,
  //         "success"
  //       );
  //     }
  //   });
  // };

  return (
    <>
      <MDBModal
        isOpen={show}
        toggle={toggle}
        backdrop
        size={showTransac ? "xl" : "lg"}
      >
        {!showTransac && (
          <MDBModalHeader
            toggle={handleClose}
            className="light-blue darken-3 white-text"
          >
            <MDBIcon icon="handshake" className="mr-2" />
            Transaction
          </MDBModalHeader>
        )}
        <MDBModalBody className={showTransac ? "mb-0 m-0 p-0" : ""}>
          {!showTransac ? (
            <>
              <div className="search-container">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Invoice..."
                    value={String(search)}
                    onChange={({ target }) => setSearch(target.value)}
                    required
                  />
                  <MDBBtn
                    size="sm"
                    color="primary"
                    rounded
                    className="search-btn "
                    onClick={() => {
                      if (!didSearch) return;
                      setDidSearch(false);
                      setSearch("");
                    }}
                    type={didSearch ? "button" : "submit"}
                  >
                    <MDBIcon icon={didSearch ? "times" : "search"} />
                  </MDBBtn>
                </form>
              </div>
              {foundTransaction.invoice_no && (
                <MDBTable>
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th className="text-center">Total Due</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-weight-bold">
                        {foundTransaction.invoice_no}
                      </td>
                      <td className="font-weight-bold text-danger text-center">
                        ₱{formattedTotal(foundTransaction.totalDue)}
                      </td>
                      <td className="text-center font-weight-bold">
                        {formattedDate(foundTransaction.createdAt)}
                      </td>
                      <td className="text-center">
                        <MDBBtnGroup>
                          <MDBBtn
                            size="sm"
                            color="primary"
                            rounded
                            title="Print"
                          >
                            <MDBIcon icon="print" />
                          </MDBBtn>

                          {/* <MDBBtn
                            onClick={() => handleAction(true)}
                            size="sm"
                            color="info"
                            title="Replacement All Product"
                          >
                            <MDBIcon icon="reply" size="1x" />
                          </MDBBtn> */}
                          {/* <MDBBtn
                            onClick={() => handleAction(false)}
                            size="sm"
                            color="danger"
                            title="Refund All Product"
                          >
                            <MDBIcon icon="share" size="1x" />
                          </MDBBtn> */}

                          <MDBBtn
                            size="sm"
                            color="warning"
                            type="button"
                            title="View Products"
                            rounded
                            onClick={() =>
                              handleViewTransaction(
                                foundTransaction.purchases,
                                foundTransaction.invoice_no,
                                foundTransaction.createdAt,
                                foundTransaction.total,
                                foundTransaction.cash
                              )
                            }
                          >
                            <MDBIcon icon="eye" />
                          </MDBBtn>
                        </MDBBtnGroup>
                      </td>
                    </tr>
                  </tbody>
                </MDBTable>
              )}
            </>
          ) : (
            <Receipt
              toggle={toggleTransac}
              invoice_no={invoice_no}
              total={total}
              customer={foundTransaction?.customer || ""}
              setTotal={setTotal}
              setPurchases={setPurchases}
              orderDetails={purchases}
              createdAt={date}
              foundTransaction={foundTransaction}
              cash={cash}
              transactionToggle={toggle}
              setTransaction={setFoundTransaction}
              setHasRefund={setHasRefund}
              hasRefund={hasRefund}
            />
          )}
        </MDBModalBody>
      </MDBModal>
    </>
  );
}
