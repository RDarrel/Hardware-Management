const GET = {
  salesAndIncome: (sales, isTransaction, isEmployees) => {
    const totalIncome = sales.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.income,
      0
    );

    const totalSales = sales.reduce((accumulator, currentValue) => {
      if (isTransaction || isEmployees) {
        return (accumulator += currentValue.total);
      }
      return (accumulator += currentValue.srp * currentValue.sold);
    }, 0);
    return { income: totalIncome, sales: totalSales };
  },

  sold: (sales) => {
    const _soldQty = sales.reduce((acc, curr) => {
      acc += curr.soldQty;
      return acc;
    }, 0);

    const _soldKilo = sales.reduce((acc, curr) => {
      acc += curr.soldKilo;
      return acc;
    }, 0);

    return { _soldKilo, _soldQty };
  },
};

export default GET;
