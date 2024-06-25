import React from "react";
import Kilo from "./kilo";
import { Quantity } from "./quantity";

const CustomInput = ({
  isAdmin = true,
  kilo,
  maxKilo = 0,
  setKilo = () => {},
  kiloGrams,
  maxKiloGrams = 0,
  setKiloGrams = () => {},
  quantity,
  maxQuantity = 0,
  setQuantity = () => {},
  baseKey = "approved",
  isPerKilo,
  index = -1,
  setMerchandises = () => {},
}) => {
  return (
    <React.Fragment key={`customInput-${index}`}>
      {isPerKilo ? (
        <Kilo
          kilo={kilo}
          setKilo={setKilo}
          isAdmin={isAdmin}
          maxKilo={maxKilo}
          maxKiloGrams={maxKiloGrams}
          baseKey={baseKey}
          kiloGrams={kiloGrams}
          index={index}
          setKiloGrams={setKiloGrams}
          setMerchandises={setMerchandises}
        />
      ) : (
        <Quantity
          quantity={quantity}
          baseKey={baseKey}
          maxQuantity={maxQuantity}
          index={index}
          isAdmin={isAdmin}
          setQuantity={setQuantity}
          setMerchandises={setMerchandises}
        />
      )}
    </React.Fragment>
  );
};

export default CustomInput;
