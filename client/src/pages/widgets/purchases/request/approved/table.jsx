import React, { useState } from "react";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import { formattedDate, fullName } from "../../../../../services/utilities";
import Modal from "../pending/modal";

const Table = ({ purchases = [] }) => {
  const [show, setShow] = useState(false),
    [merchandises, setMerchandises] = useState([]),
    [purchase, setPurchase] = useState({});

  const toggle = () => setShow(!show);
  return (
    <>
      <MDBTable responsive hover>
        <thead>
          <tr>
            <th className="cursor-pointer">#&nbsp;</th>
            <th className="th-lg">Stockman</th>
            <th>Approved Date</th>
            <th>Total Amount</th>
            <th className="th-lg text-center">Approved Products</th>
          </tr>
        </thead>
        <tbody>
          {!!purchases &&
            purchases.map((purchase, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fullName(purchase?.requestBy?.fullName)}</td>
                <td>{formattedDate(purchase.approved)}</td>
                <td className="font-weight-bolder text-danger">
                  ₱ {purchase.total.toLocaleString()}
                </td>
                <td className="text-center">
                  <MDBBtn
                    color="success"
                    size="sm"
                    onClick={() => {
                      setPurchase(purchase);
                      setMerchandises(purchase.merchandises);
                      toggle();
                    }}
                  >
                    <MDBIcon icon="shopping-cart" />
                  </MDBBtn>
                </td>
              </tr>
            ))}
        </tbody>
      </MDBTable>
      <Modal
        isApproved={true}
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
