const formattedTotal = (total) => {
  if (total % 1 !== 0) {
    return `${total.toLocaleString()}`;
  } else {
    return `${total.toLocaleString()}.00`;
  }
};

export default formattedTotal;
