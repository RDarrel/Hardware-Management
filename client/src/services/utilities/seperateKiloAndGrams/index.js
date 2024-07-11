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
const seperateKiloAndGrams = (totalKilo) => {
  const totalKiloInArray = String(totalKilo).split(".");
  const kilo = Number(totalKiloInArray[0] || 0);
  const kiloGrams = gramsConverter(Number(totalKiloInArray[1] || 0));
  return { kilo, kiloGrams };
};

export default seperateKiloAndGrams;
