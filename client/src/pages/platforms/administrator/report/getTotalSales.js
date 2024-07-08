const getTotalSales = (sales) => {
  if (!!sales) {
    return (
      sales
        .reduce((acc, curr) => {
          acc += curr.total;
          return acc;
        }, 0)
        .toLocaleString() || 0
    );
  } else {
    return 0;
  }
};

export default getTotalSales;
