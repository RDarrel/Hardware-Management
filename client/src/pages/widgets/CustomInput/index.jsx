import React from "react";
import Kilo from "./kilo";
import { Quantity } from "./quantity";

const CustomInput = ({
  kilo,
  setKilo = () => {},
  kiloGrams,
  setKiloGrams = () => {},
  quantity,
  setQuantity = () => {},
  isPerKilo,
  index = -1,
  setMerchandises = () => {},
}) => {
  return (
    <>
      {isPerKilo ? (
        <Kilo
          kilo={kilo}
          setKilo={setKilo}
          kiloGrams={kiloGrams}
          index={index}
          setKiloGrams={setKiloGrams}
          setMerchandises={setMerchandises}
        />
      ) : (
        <Quantity
          quantity={quantity}
          index={index}
          setQuantity={setQuantity}
          setMerchandises={setMerchandises}
        />
      )}
    </>
  );
};

export default CustomInput;
