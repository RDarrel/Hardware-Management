const filterBy = (key, array) => {
  return array
    .filter((collec, index, copy) => {
      return (
        index === copy.findIndex((orig) => orig[key]._id === collec[key]._id)
      );
    })
    .map((obj) => obj[key]);
};

export default filterBy;
