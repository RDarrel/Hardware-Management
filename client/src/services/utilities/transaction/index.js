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

  computeSubtotal: (purchases = []) => {
    if (purchases.length === 0) return [];
    return purchases.map((purchase) => {
      const { product, kilo = 0, kiloGrams = 0, quantity = 0, srp } = purchase;

      var totalPurchase = product.isPerKilo ? kilo + kiloGrams : quantity;
      return { ...purchase, subtotal: totalPurchase * srp };
    });
  },
};

export default transaction;
