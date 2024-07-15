const gramsConverter = (grams) => {
  switch (grams) {
    case 5:
      return 0.5;
    case 75:
      return 0.75;
    case 25:
      return 0.25;
    default:
      return grams;
  }
};
const GET = {
  newKiloAndGrams: (
    _kiloGrams = 0,
    _kilo = 0,
    kiloGramsDefect = 0,
    kiloDefect = 0
  ) => {
    const totalKiloAndGramsDefect = kiloGramsDefect + kiloDefect;
    const totalKiloAndGrams = _kiloGrams + _kilo;
    const newTotalKiloAndGramsRes = totalKiloAndGrams - totalKiloAndGramsDefect;
    var newKilo = 0;
    var newKiloGrams = 0;
    if (newTotalKiloAndGramsRes < 1) {
      newKilo = 0;
      newKiloGrams = newTotalKiloAndGramsRes;
    } else {
      const totalDeducConvertInArray = String(newTotalKiloAndGramsRes).split(
        "."
      );
      newKilo = Number(totalDeducConvertInArray[0] || 0);
      newKiloGrams = Number(totalDeducConvertInArray[1] || 0);
    }
    return { kilo: newKilo || 0, kiloGrams: gramsConverter(newKiloGrams) };
  },

  arrangeData: (_collections) => {
    return (
      _collections.length > 0 &&
      _collections.reduce((acc, curr) => {
        const key = curr?.supplier?._id;
        const index = acc.findIndex(({ key: _key }) => _key === key);
        if (index > -1) {
          acc[index].stockmans.push(curr);
        } else {
          acc.push({ ...curr, stockmans: [curr], key });
        }
        return acc;
      }, [])
    );
  },

  changeSupplier: (supplier, collections, setPurchases) => {
    if (supplier === "all" || !supplier) {
      const _purchases = GET.arrangeData(collections);
      setPurchases(_purchases || []);
    } else {
      const _purchases =
        (collections.length > 0 &&
          collections?.filter(
            ({ supplier: supp = {} }) => supp?._id === supplier
          )) ||
        [];
      setPurchases(GET.arrangeData(_purchases || []));
    }
  },

  subtotal: (capital, merchandise, isPerKilo) => {
    const { kilo, quantity, kiloGrams } = merchandise || {};
    if (isPerKilo) {
      const totalKgInDefective = kilo.defective + kiloGrams.defective;
      const totalKgReceived = kilo.received + kiloGrams.received;
      const resultForDeductionKg = totalKgReceived - totalKgInDefective;
      return resultForDeductionKg * capital;
    } else {
      const totalForDeductionQty = quantity.received - quantity.defective;
      return totalForDeductionQty * capital;
    }
  },

  totalAmount: (merchandises = [], key = "") => {
    if (
      merchandises.length === 0 ||
      !merchandises[0]?.quantity?.hasOwnProperty("defective")
    )
      return 0;
    const arrangeData = merchandises.map((merchandise) => {
      const { quantity, kilo, kiloGrams, product, capital } = merchandise;
      return {
        ...(product.isPerKilo
          ? { kilo: (kilo[key] || 0) + (kiloGrams[key] || 0) }
          : { quantity: quantity[key] || 0 }),
        isPerKilo: product.isPerKilo,
        capital,
      };
    });

    const subtotals = arrangeData.map(
      ({ quantity, kilo, isPerKilo, capital }) => {
        return isPerKilo ? capital * kilo : capital * quantity;
      }
    );
    return (
      subtotals.reduce((acc, curr) => {
        acc += curr;
        return acc;
      }, 0) || 0
    );
  },
};

export default GET;
