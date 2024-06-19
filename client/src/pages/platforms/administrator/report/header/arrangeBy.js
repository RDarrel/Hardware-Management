const arrangeBy = {
  employees: (sales) => {
    return sales //this is for the employees report arrange by transaction
      .reduce((accumulator, currentValue) => {
        const { cashier, total } = currentValue;
        const key = `${cashier._id}`;
        const index = accumulator?.findIndex((accu) => accu.key === key);
        if (index > -1) {
          accumulator[index].transactionsHandle += 1;
          accumulator[index].total += total;
        } else {
          accumulator.push({
            ...currentValue,
            key,
            transactionsHandle: 1,
            total,
          });
        }
        return accumulator;
      }, [])
      .sort((a, b) => b.transactionsHandle - a.transactionsHandle);
  },

  sales: (sales) => {
    return sales //this is for the sales i arranged the data by the product then sort this into the sold
      .reduce((accumulator, currentValue) => {
        const { product, variant1, variant2, quantity, kilo, income } =
          currentValue;
        const key = `${product._id}-${variant1}-${variant2}`;
        const index = accumulator?.findIndex((accu) => accu.key === key);
        if (index > -1) {
          accumulator[index].sold += quantity || kilo;
          accumulator[index].income += income;
          accumulator[index].soldKilo += kilo || 0;
          accumulator[index].soldQty += quantity || 0;
        } else {
          accumulator.push({
            ...currentValue,
            key,
            sold: quantity || kilo,
            soldQty: quantity || 0,
            soldKilo: kilo || 0,
          });
        }
        return accumulator;
      }, [])
      .sort((a, b) => b.sold - a.sold);
  },
};

export default arrangeBy;
