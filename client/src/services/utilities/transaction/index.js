const transaction = {
  getTotal: (purchases = []) => {
    if (purchases.length === 0) return 0;

    const purchaseWithSubtotal = purchases.map((purchase) => {
      const { product, kilo = 0, kiloGrams = 0, quantity = 0, srp } = purchase;

      var totalPurchase = product.isPerKilo ? kilo + kiloGrams : quantity;
      return { ...purchase, subtotal: totalPurchase * srp };
    });

    const total = purchaseWithSubtotal.reduce((acc, curr) => {
      acc += curr.subtotal;
      return acc;
    }, 0);
    return total;
  },

  computeSubtotal: (purchases = [], isRefund = false) => {
    if (purchases.length === 0) return [];
    return purchases.map((purchase) => {
      const {
        product,
        kilo = 0,
        kiloGrams = 0,
        quantity = 0,
        srp,
        kiloRefund,
        quantityRefund,
      } = purchase;

      var totalPurchase = product.isPerKilo
        ? isRefund
          ? kiloRefund
          : kilo + kiloGrams
        : isRefund
        ? quantityRefund
        : quantity;
      return { ...purchase, subtotal: totalPurchase * srp };
    });
  },

  totalRefund: (purchases = []) => {
    const purchasesWithSubtotal = transaction.computeSubtotal(purchases, true);
    return purchasesWithSubtotal.reduce(
      (acc, curr) => (acc += curr.subtotal),
      0
    );
  },
};

export default transaction;
