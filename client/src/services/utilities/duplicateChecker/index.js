const isValid = (array, compare, key, oldName = "") => {
  return array.some(
    (obj) =>
      obj[key].replace(/\s/g, "").toLowerCase() ===
        compare.replace(/\s/g, "").toLowerCase() && compare !== oldName
  );
};

export default isValid;
