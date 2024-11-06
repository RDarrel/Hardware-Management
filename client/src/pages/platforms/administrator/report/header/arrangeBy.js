const arrangeSalesBySummary = (sale) => {
  const {
    sold = 0,
    srp = 0,
    discount = 0,
    refundQuantity = 0,
    capital = 0,
  } = sale;
  const grossSales = sold * srp;
  const refundAmount = (refundQuantity || 0) * srp;
  const totalDeduc = refundAmount + (discount || 0);
  const netSales = grossSales - totalDeduc;
  const income = netSales - capital * sold;
  return { grossSales, refundAmount, netSales, income, discount };
};

const getFrequency = (createdAt, frequency) => {
  const date = new Date(createdAt);
  date.setHours(0, 0, 0, 0);
  if (frequency === "Daily") {
    return {
      from: date,
      to: date,
      date: date.toLocaleDateString("en-US"),
    };
  } else if (frequency === "Weekly") {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      from: weekStart,
      to: weekEnd,
      date: `${weekStart.toLocaleDateString(
        "en-US"
      )} - ${weekEnd.toLocaleDateString("en-US")}`,
    };
  } else if (frequency === "Monthly") {
    const monthStart = new Date(date);
    const monthEnd = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      monthStart.getDate()
    );
    return {
      from: monthStart,
      to: monthEnd,
      date: `${monthStart.toLocaleDateString(
        "en-US"
      )} - ${monthEnd.toLocaleDateString("en-US")}`,
    };
  } else if (frequency === "Yearly") {
    const yearStart = new Date(date);
    const yearEnd = new Date(
      yearStart.getFullYear() + 1,
      yearStart.getMonth(),
      yearStart.getDate()
    );

    return {
      from: yearStart,
      to: yearEnd,
      date: `${yearStart.toLocaleDateString(
        "en-US"
      )} - ${yearEnd.toLocaleDateString("en-US")}`,
    };
  }
};

const hasBelongChecker = (createdAt, existingSale) => {
  const date = new Date(createdAt);
  date.setHours(0, 0, 0, 0);
  return date >= existingSale?.from && date <= existingSale?.to;
};

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

  sales: (_sales, frequency, salesType = "Detailed") => {
    const dates = [];

    const reducedSales = _sales
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((accumulator, currentValue) => {
        const {
          product,
          variant1,
          variant2,
          quantity,
          kilo,
          income,
          refundQuantity = 0,
          discount = 0,
          capital,
          refundAmount = 0,
          netSales = 0,
          grossSales,
          srp,
          createdAt,
        } = currentValue;

        const date = new Date(createdAt);
        date.setHours(0, 0, 0, 0);

        let baseCreatedAt = date;
        const indexOfDate = dates.findIndex(
          ({ from, to }) => date >= from && date <= to
        );

        if (indexOfDate > -1) {
          baseCreatedAt = dates[indexOfDate]?.createdAt;
        } else {
          dates.push({
            ...getFrequency(createdAt, frequency),
            createdAt: date,
          });
        }

        const totalDiscount = discount;
        const sold = quantity || kilo;

        const key = `${product._id}-${variant1}-${variant2}-${capital}-${srp}`;
        let isDetailedType = salesType === "Detailed";
        const baseKey = !isDetailedType ? "baseCreatedAt" : "key";
        const baseComparison = isDetailedType ? key : baseCreatedAt;

        const additionalCondition = !isDetailedType
          ? (accu) => accu.product.isPerKilo === product.isPerKilo
          : () => true;

        const index = accumulator?.findIndex(
          (accu) =>
            accu[baseKey] === baseComparison && additionalCondition(accu)
        );
        const existingSale = accumulator[index];

        if (index > -1 && hasBelongChecker(createdAt, existingSale)) {
          accumulator[index].sold += sold;
          accumulator[index].refundQuantity += refundQuantity;
          accumulator[index].netSales += netSales;

          accumulator[index].totalDiscount += totalDiscount; // new added
          accumulator[index].discount += discount; // new added
          accumulator[index].grossSales += grossSales; // new added
          accumulator[index].refundAmount += refundAmount; // new added
          accumulator[index].income += income;
        } else {
          accumulator.push({
            ...currentValue,
            key,
            income,
            totalDiscount,
            sold,
            refundAmount,
            soldQty: quantity || 0,
            soldKilo: kilo || 0,
            baseCreatedAt,
            // ...(!isDetailedType && {
            //   ...arrangeSalesBySummary({ ...currentValue, sold }),
            // }),
            ...getFrequency(baseCreatedAt, frequency),
          });
        }
        return accumulator;
      }, []);

    // Final sorting: Sort first by date, then by sold quantity
    return reducedSales
      .sort((a, b) => {
        const dateComparison =
          new Date(a.baseCreatedAt) - new Date(b.baseCreatedAt);
        if (dateComparison !== 0) return dateComparison;
        const aSold = a.sold - (a.refundQuantity || 0);
        const bSold = b.sold - (b.refundQuantity || 0);
        return bSold - aSold;
      })
      .map((sale, index, sortedSales) => {
        const oldCreatedAt = new Date(sortedSales[index - 1]?.baseCreatedAt);
        const saleCreatedAt = new Date(sale.baseCreatedAt);
        const isSameDate =
          oldCreatedAt.getFullYear() === saleCreatedAt.getFullYear() &&
          oldCreatedAt.getMonth() === saleCreatedAt.getMonth() &&
          oldCreatedAt.getDate() === saleCreatedAt.getDate();
        const date = isSameDate ? "" : sale.date;

        return {
          ...sale,
          date,
        };
      });
  },
};

export default arrangeBy;
