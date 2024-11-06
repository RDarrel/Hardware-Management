const netAndIncome = (sale, isPerKilo) => {
  const {
    kilo,
    quantity,
    capital,
    srp,
    discount = 0,
    refundQuantity = 0,
  } = sale;
  const sold = isPerKilo ? kilo : quantity;
  const grossSales = srp * sold;
  const totalDeduc = discount + (refundQuantity || 0) * srp;
  const netSales = grossSales - totalDeduc;
  const income = netSales - capital * sold;

  return { income, net: netSales };
};

export default netAndIncome;
