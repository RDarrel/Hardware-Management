const formattedTotal = (total) => {
  if (!total) return "0.00";

  return parseFloat(total)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default formattedTotal;

// const formattedTotal = (total) => {
//   if (!total) return "0.00";
//   if (total % 1 !== 0) {
//     const arrTotal = String(total).split(".");
//     const decimalLength = arrTotal[1]?.length || 0;
//     return ${total.toLocaleString()}${decimalLength === 1 ? "0" : ""};
//   } else {
//     return ${total.toLocaleString()}.00;
//   }
// };
