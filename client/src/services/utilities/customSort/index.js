const customSort = (referenceArray, objectsArray, key = "_id") => {
  const referenceSet = new Set(referenceArray);
  const filtered = [];
  const remaining = [];

  objectsArray.forEach((object) => {
    if (referenceSet.has(object[key])) {
      filtered.push(object);
    } else {
      remaining.push(object);
    }
  });

  filtered.sort(
    (a, b) => referenceArray.indexOf(a[key]) - referenceArray.indexOf(b[key])
  );

  return [...filtered, ...remaining];
};

export default customSort;
