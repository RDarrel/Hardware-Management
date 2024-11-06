const GET = {
  salesAndIncome: (sales, frequency = "Detailed") => {
    const isDetailedType = frequency === "Detailed";
    const totalIncome = sales.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.income,
      0
    );

    const totalSales = sales.reduce((accumulator, currentValue) => {
      // if (isTransaction || isEmployees) {
      //   return (accumulator += currentValue.total);
      // }
      return (accumulator += isDetailedType
        ? currentValue.srp * currentValue.sold
        : currentValue.grossSales);
    }, 0);

    const totalRefund = sales.reduce(
      (acc, curr) => (acc += curr.refundAmount || 0),
      0
    );
    const totalDiscount = sales.reduce(
      (acc, curr) => (acc += curr.totalDiscount || 0),
      0
    );

    return {
      income: totalIncome,
      sales: totalSales,
      totalRefund,
      totalDiscount,
    };
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
