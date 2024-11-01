const getSalesAndIncome = (sales) => {
  const _sales = [...sales];
  const totalIncome =
    _sales.reduce((acc, curr) => (acc += curr.income), 0) || 0;

  const totalSales =
    _sales.reduce((acc, curr) => {
      const { product = {}, kilo = 0, quantity = 0, srp } = curr;
      const { isPerKilo = false } = product;

      if (isPerKilo) {
        acc += kilo * srp;
      } else {
        acc += quantity * srp;
      }
      return acc;
    }, 0) || 0;

  return { totalIncome, totalSales };
};

export default getSalesAndIncome;
