import React from "react";
import {
  MDBCol,
  MDBCard,
  MDBTable,
  MDBCardBody,
  MDBDatePicker,
  MDBCardImage,
} from "mdbreact";

const Suppliers = ({ suppliers = [], setSuppliers }) => {
  const handleChangeDate = (newDate, index) => {
    const _suppliers = [...suppliers];
    _suppliers[index].expectedDelivered = newDate;
    setSuppliers(_suppliers);
  };
  return (
    <MDBCol>
      <MDBCard narrow>
        <MDBCardImage
          className="view view-cascade gradient-card-header blue-gradient"
          cascade
          tag="div"
        >
          <h5 className="font-weight-500 mb-0"> Suppliers</h5>
        </MDBCardImage>
        <MDBCardBody>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <MDBTable>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-center">Supplier</th>
                  <th className="text-center">Total Amount</th>
                  <th className="text-center">Expected Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center font-weight-bold">
                      {supplier.company}
                    </td>
                    <td className="text-center text-danger font-weight-bold">
                      ₱{supplier.totalAmount.toLocaleString()}
                    </td>
                    <td className="d-flex justify-content-center ">
                      <MDBDatePicker
                        className="m-0 mt-2 p-0 ml-5"
                        value={supplier.setExpectedDelivered}
                        getValue={(value) =>
                          handleChangeDate(value.toLocaleString(), index)
                        }
                        minDate={new Date().toLocaleString()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </MDBTable>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Suppliers;
