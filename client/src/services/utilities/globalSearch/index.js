const globalSearch = (objects, key) =>
  objects.filter((obj) => {
    if (typeof obj === "object") {
      let nestedResults = globalSearch(Object.values(obj || {}), key);
      return nestedResults.length > 0;
    } else if (
      typeof obj === "string" &&
      obj
        .replace(/\s+/g, "")
        .toUpperCase()
        .includes(key.replace(/\s+/g, "").toUpperCase())
    ) {
      return true;
    }
    return false;
  });

export default globalSearch;
