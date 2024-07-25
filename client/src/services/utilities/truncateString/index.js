const truncateString = (str) => {
  const max = 100;
  if (str.length <= max) {
    return str;
  }
  return str.slice(0, max) + "...";
};

export default truncateString;
