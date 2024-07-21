import { MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInputGroup } from "mdbreact";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import seperateKiloAndGrams from "../../../services/utilities/seperateKiloAndGrams";

const Kilo = ({
  kilo,
  setKilo,
  kiloGrams,
  setKiloGrams,
  handleSubmit,
  isCustomer = false,
  availableStocks = 0,
}) => {
  const showText = () => {
    const { kilo: kl = 0, kiloGrams: kg = 0 } =
      seperateKiloAndGrams(availableStocks);
    var grams = "";
    console.log(kg);
    switch (kg) {
      case 0.5:
        grams = "1/4";
        break;

      case 0.75:
        grams = "3/4";
        break;
      case 0.25:
        grams = "1/2";
        break;

      default:
        grams = "";
        break;
    }
    return `${
      kl > 0 ? `${kl} ${kl > 1 ? "Kilos" : "kilo"} and` : ""
    } ${grams} ${kl === 0 ? "grams" : ""}`;
  };

  useEffect(() => {
    if (isCustomer) {
      const totalKilo = kilo + kiloGrams;
      if (totalKilo > availableStocks && availableStocks > 0) {
        const { kilo: kl = 0, kiloGrams: kg = 0 } =
          seperateKiloAndGrams(availableStocks);

        console.log(kl);
        setKilo(kl);
        setKiloGrams(kg);
      }
    }
  }, [kilo, kiloGrams, isCustomer, availableStocks, setKilo, setKiloGrams]);

  const handleDisableGrams = (kilo, kiloGrams) => {
    if (!isCustomer) return false;
    if (kilo > availableStocks) {
      const { grams } = seperateKiloAndGrams(availableStocks);
      if (kiloGrams > grams) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleChangeKilo = (newKilo) => {
    if (isCustomer) {
      const totalKilo = newKilo + kiloGrams;
      if (totalKilo > availableStocks && availableStocks > 0) {
        const { kilo: kl = 0, kiloGrams: kg = 0 } =
          seperateKiloAndGrams(availableStocks);

        setKilo(kl);
        setKiloGrams(kg);
        Swal.fire({
          icon: "warning",
          title: "Stock Limit Exceeded",
          text: `You can only purchase up to ${showText()} `,
          confirmButtonText: "OK",
        });
      } else {
        setKilo(newKilo);
      }
    } else {
      setKilo(newKilo);
    }
  };

  return (
    <MDBRow className="mt-4 d-flex align-items-center">
      <MDBCol md="2">
        <h6 className={!isCustomer ? "" : "grey-text"}>Kilo:</h6>
      </MDBCol>
      <MDBCol
        md={isCustomer ? "6" : "4"}
        className="m-0 d-flex align-items-center"
      >
        <MDBInputGroup
          type="number"
          value={String(kilo)}
          onChange={({ target }) => {
            var newKilo = Number(target.value);
            if (newKilo < 0) newKilo = 0;
            console.log(newKilo);
            handleChangeKilo(newKilo);
          }}
          className="text-center border border-light"
          append={
            <select
              className="form-control"
              value={String(kiloGrams)}
              onChange={({ target }) => setKiloGrams(Number(target.value))}
            >
              <option value={"0"} disabled={handleDisableGrams(kilo, 0)}>
                kl
              </option>
              <option
                value={"0.25"}
                disabled={handleDisableGrams(kilo, 0.25)}
                className={handleDisableGrams(kilo, 0.25) ? "bg-danger" : ""}
              >
                1/4 kl
              </option>
              <option
                value={"0.5"}
                disabled={handleDisableGrams(kilo, 0.5)}
                className={handleDisableGrams(kilo, 0.5) ? "bg-danger" : ""}
              >
                1/2 kl
              </option>
              <option
                value={"0.75"}
                disabled={handleDisableGrams(kilo, 0.75)}
                className={handleDisableGrams(kilo, 0.75) ? "bg-danger" : ""}
              >
                3/4 kl
              </option>
            </select>
          }
        />
        {isCustomer && (
          <h6 className="grey-text ml-2 mt-2 text-nowrap">
            {showText()} available
          </h6>
        )}
      </MDBCol>
      {!isCustomer && (
        <MDBCol md="6" className="d-flex align-items-center">
          <MDBBtn
            color="primary"
            type="submit"
            size="md"
            className="text-nowrap"
            outline
            onClick={handleSubmit}
          >
            <MDBIcon icon="shopping-cart" className="mr-1" /> ADD TO CART
          </MDBBtn>
          <MDBBtn
            color="danger"
            type="button"
            size="md"
            onClick={() => handleSubmit(false)}
          >
            Buy Now
          </MDBBtn>
        </MDBCol>
      )}
    </MDBRow>
  );
};

export default Kilo;
