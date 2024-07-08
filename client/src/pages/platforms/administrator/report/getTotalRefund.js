const getTotalRefundAmount = (purchases) => {
  if (purchases?.length === 0) return 0;
  console.log(purchases);
  const subtotal = purchases.map((purchase) => {
    const {
      kiloRefund = 0,
      kiloGramsRefund = 0,
      quantityRefund = 0,
      srp,
      product,
    } = purchase;

    if (product.isPerKilo) {
      return kiloRefund + kiloGramsRefund * srp;
    } else {
      return quantityRefund * srp;
    }
  });

  return (
    subtotal
      .reduce((acc, curr) => {
        acc += curr;
        return acc;
      }, 0)
      ?.toLocaleString() || 0
  );
};

export default getTotalRefundAmount;
