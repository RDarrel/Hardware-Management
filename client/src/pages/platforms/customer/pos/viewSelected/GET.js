import seperateKiloAndGrams from "../../../../../services/utilities/seperateKiloAndGrams";

const minAndMax = (srps = []) => {
  const minSrp = Math.min(...srps);
  const maxSrp = Math.max(...srps);
  return minSrp === maxSrp ? minSrp : `${minSrp} - ₱${maxSrp}`;
};
const defaultPrice = (selected) => {
  const { srp = 0, hasVariant, has2Variant, variations = [] } = selected;
  if (!hasVariant) return srp;

  if (hasVariant) {
    const variant = { ...variations[0] };
    const options = [...variant.options];
    const srps = options
      .map(({ srp = 0, max = 0, disable = false }) =>
        max && !disable ? srp : false
      )
      .filter(Boolean);
    var total = minAndMax(srps);

    if (has2Variant) {
      const srpsInVr2 = options
        .flatMap((option) =>
          option.prices.map(({ srp = 0, max = 0, disable = false }) =>
            max && !disable ? srp : false
          )
        )
        .filter(Boolean);
      total = minAndMax(srpsInVr2);
    }

    return total;
  }
};

const computeStocks = (stocks) => {
  return stocks.reduce((acc, curr) => (acc += curr), 0);
};

const totalStocks = (selected, selectedVr1, selectedVr2) => {
  const { hasVariant, has2Variant, variations = [], max = 0 } = selected;
  if (!hasVariant) return max;
  var total = 0;
  const variant = { ...variations[0] };
  const options = [...variant.options];
  if (hasVariant && selectedVr1 && !has2Variant) {
    total = options.find(({ _id }) => _id === selectedVr1)?.max || 0;
  } else {
    if (!has2Variant) {
      const stocks = options
        .map(({ max = 0, disable = false }) => (max && !disable ? max : false))
        .filter(Boolean);
      total = computeStocks(stocks);
    }
  }

  if (selectedVr2 && selectedVr1 && has2Variant) {
    const prices = options.find(({ _id }) => _id === selectedVr1)?.prices || [];
    total = prices.find(({ _id }) => _id === selectedVr2)?.max || 0;
  } else {
    if (has2Variant) {
      const stocksInVr2 = options
        .flatMap((option) =>
          option.prices.map(({ max = 0, disable = false }) =>
            max && !disable ? max : false
          )
        )
        .filter(Boolean);
      total = computeStocks(stocksInVr2);
    }
  }
  return total;
};

const converteKilo = (totalKilo) => {
  const { kilo: kl = 0, kiloGrams: kg = 0 } = seperateKiloAndGrams(totalKilo);
  var grams = "";
  switch (kg) {
    case 0.5:
      grams = "1/2";
      break;

    case 0.75:
      grams = "3/4";
      break;
    case 0.25:
      grams = "1/4";
      break;

    default:
      grams = "";
      break;
  }
  return `${kl > 0 ? `${kl} ${kl > 1 ? "Kilos" : "kilo"}` : ""} ${
    kg > 0 ? `${kl > 0 ? "and" : ""} ${grams} ${kl === 0 ? "grams" : ""} ` : ""
  } `;
};

const GET = {
  defaultPrice: (selected) => defaultPrice(selected),
  totalStocks: (selected, selectedVr1, selectedVr2) =>
    totalStocks(selected, selectedVr1, selectedVr2),
  converterKilo: (totalKilo) => converteKilo(totalKilo),
};

export default GET;
