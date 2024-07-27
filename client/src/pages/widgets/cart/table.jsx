import React, { useState } from "react";
import { MDBTable } from "mdbreact";
import {
  UPDATE,
  DESTROY,
  changeVariant,
} from "../../../services/redux/slices/cart";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Tbody } from "./tbody";

const Table = ({
  cart,
  checkOutProducts,
  handleActionInCheckOut,
  handleChangeSelectAll,
  isCheckAll,
  isCustomer,
  suppliers,
  disabledButtons,
}) => {
  const { token } = useSelector(({ auth }) => auth),
    [popoverKey, setPopoverKey] = useState(0),
    [variant1, setVariant1] = useState(null),
    [variant2, setVariant2] = useState(null),
    dispatch = useDispatch();

  const handleClose = () => {
    setPopoverKey((prevKey) => prevKey + 1);
  };

  const getTheVariant = (_variant1, _variant2, variations) => {
    const foundVariant1 = variations[0].options.find(
      ({ _id }) => _id === _variant1
    )?.name;

    if (variations.length > 1) {
      const foundVariant2 = variations[1].options.find(
        ({ _id }) => _id === _variant2
      )?.name;

      return `${foundVariant1} / ${foundVariant2}`;
    } else {
      return `${foundVariant1}`;
    }
  };

  const handleUpdateVariant = (cart, oldVariant) => {
    if (
      cart?.variant1 === oldVariant?.variant1 &&
      cart?.variant2 === oldVariant?.variant2
    )
      return handleClose();

    dispatch(changeVariant({ token, data: cart }));
    handleClose();
  };

  const handleChangeQty = (action, newQty, _id) => {
    if (action === "ADD") {
      dispatch(
        UPDATE({
          token,
          data: { _id, newQty, action: "quantity", operator: "ADD" },
        })
      );
    } else if (action === "MINUS") {
      dispatch(
        UPDATE({
          token,
          data: {
            _id,
            newQty: newQty,
            action: "quantity",
            operator: "MINUS",
          },
        })
      );
    } else {
      dispatch(
        UPDATE({
          token,
          data: { _id, newQty, action: "quantity", isOnChange: true }, //kapag onchange ibig sabihin  sa input type siya nag bago
        })
      );
    }
  };

  const handleChangeKilo = (_id, newKilo) => {
    dispatch(
      UPDATE({
        token,
        data: { _id, newKilo, action: "kilo" },
      })
    );
  };

  const handleChangeKiloGrams = (_id, newKiloGrams) => {
    dispatch(
      UPDATE({
        token,
        data: { _id, newKiloGrams, action: "kiloGrams" },
      })
    );
  };

  const handleChangeSupplier = (cart, newSupplier) => {
    if (cart.supplier === newSupplier) return false;
    dispatch(
      UPDATE({
        token,
        data: { _id: cart._id, supplier: newSupplier, action: "supplier" },
      })
    );
  };

  const handleRemoveCart = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this product in your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DESTROY({
            token,
            data: { _id },
          })
        );
        Swal.fire({
          title: "Success!",
          text: "Your product in your cart has been removed.",
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <MDBTable>
        <thead>
          <tr>
            <th>
              <div className="d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isCheckAll}
                  id="checkbox"
                  onChange={() => handleChangeSelectAll(!isCheckAll)}
                />
                <label
                  htmlFor="checkbox"
                  className="form-check-label mr-2 label-table"
                />
                Product
              </div>
            </th>
            {isCustomer && <th className="text-center">SRP</th>}

            <th className="text-center">Quantity/Kilo</th>
            {!isCustomer && <th className="text-center">Supplier</th>}
            {isCustomer && <th>Subtotal</th>}
            <th>Action</th>
          </tr>
        </thead>
        <Tbody
          checkOutProducts={checkOutProducts}
          variant1={variant1}
          variant2={variant2}
          disabledButtons={disabledButtons}
          setVariant1={setVariant1}
          setVariant2={setVariant2}
          handleChangeKilo={handleChangeKilo}
          handleClose={handleClose}
          handleChangeKiloGrams={handleChangeKiloGrams}
          handleChangeQty={handleChangeQty}
          cart={cart}
          handleRemoveCart={handleRemoveCart}
          getTheVariant={getTheVariant}
          handleUpdateVariant={handleUpdateVariant}
          popoverKey={popoverKey}
          isCheckAll={isCheckAll}
          handleActionInCheckOut={handleActionInCheckOut}
          isCustomer={isCustomer}
          suppliers={suppliers}
          handleChangeSupplier={handleChangeSupplier}
        />
      </MDBTable>
    </>
  );
};

export default Table;
