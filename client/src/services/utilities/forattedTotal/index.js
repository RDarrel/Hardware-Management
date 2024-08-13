const formattedTotal = (total) => {
  if (total % 1 !== 0) {
    const arrTotal = String(total).split(".");
    const decimalLength = arrTotal[1].length;
    return `${total.toLocaleString()}${decimalLength === 1 ? "0" : ""}`;
  } else {
    return `${total.toLocaleString()}.00`;
  }
};

export default formattedTotal;
