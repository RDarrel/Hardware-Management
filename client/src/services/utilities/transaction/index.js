import variation from "../variation/variation";

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

  totalVat: (purchases) => {
    const _purchases = purchases.map((purchase) => {
      const { quantity = 0, kilo = 0, kiloGrams = 0, product } = purchase;
      const { isPerKilo = false } = product;
      const totalOrder = isPerKilo ? kilo + kiloGrams : quantity;

      const subtotal = variation.getTheSubTotal("srp", purchase, product);

      const haveDiscount = totalOrder >= 15;

      return {
        ...purchase,
        vat: subtotal * 0.12,
        discount: haveDiscount ? subtotal * 0.1 : 0,
      };
    });

    return _purchases.reduce((acc, curr) => (acc += curr.vat), 0);
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
