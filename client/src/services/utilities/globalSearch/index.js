const globalSearch = (objects, key) =>
  objects.filter((obj) => {
    console.log(key);
    if (typeof obj === "object") {
      let nestedResults = globalSearch(Object.values(obj || {}), key);
      return nestedResults.length > 0;
    } else if (typeof obj === "string" && obj.toUpperCase().includes(key)) {
      return true;
    }
    return false;
  });

export default globalSearch;
