const incomePerSale = (sale, isPerKilo) => {
  const { kilo, quantity, capital, srp } = sale;
  return isPerKilo
    ? srp * kilo - capital * kilo
    : srp * quantity - capital * quantity;
};

export default incomePerSale;
