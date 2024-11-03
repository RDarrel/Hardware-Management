const arrangeBy = {
  employees: (sales) => {
    return sales //this is for the employees report arrange by transaction
      .reduce((accumulator, currentValue) => {
        const {
          cashier,
          total,
          returnItemCount = 0,
          refundItemCount = 0,
          totalRefundSales = 0,
          totalReturnSales = 0,
        } = currentValue;
        const key = `${cashier?._id}`;
        const index = accumulator?.findIndex((accu) => accu.key === key);
        if (index > -1) {
          accumulator[index].transactionsHandle += 1;
          accumulator[index].returnItemCount =
            (accumulator[index].returnItemCount || 0) + returnItemCount;
          accumulator[index].refundItemCount =
            (accumulator[index].refundItemCount || 0) + refundItemCount;
          accumulator[index].totalRefundSales =
            (accumulator[index].totalRefundSales || 0) + totalRefundSales;
          accumulator[index].totalReturnSales =
            (accumulator[index].totalReturnSales || 0) + totalReturnSales;

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

  sales: (_sales) => {
    return _sales //this is for the sales i arranged the data by the product then sort this into the sold
      .reduce((accumulator, currentValue) => {
        const {
          product,
          variant1,
          variant2,
          quantity,
          kilo,
          income,
          refund = 0,
          discount = 0,
          capital,
          srp,
        } = currentValue;
        const key = `${product._id}-${variant1}-${variant2}-${capital}-${srp}`;
        const index = accumulator?.findIndex((accu) => accu.key === key);
        const totalRefund = refund;
        const totalDiscount = discount;
        const sold = quantity || kilo;
        const netSales = sold * srp - (discount + refund);
        const vat = netSales * 0.12;
        if (index > -1) {
          accumulator[index].sold += sold;
          accumulator[index].totalRefund += totalRefund; // new added
          accumulator[index].netSales += netSales; // new added
          accumulator[index].vat += vat; // new added
          accumulator[index].totalDiscount += totalDiscount; // new added
          accumulator[index].income += income;
          accumulator[index].soldKilo += kilo || 0;
          accumulator[index].soldQty += quantity || 0;
        } else {
          accumulator.push({
            ...currentValue,
            key,
            income,
            netSales,
            totalDiscount,
            vat,
            sold,
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
