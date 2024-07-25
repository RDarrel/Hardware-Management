const capitalize = {
  firstLetter: (name) => {
    const exceptions = ["and", "or", "of", "in", "on", "at", "to", "with"];
    return name
      ?.split(" ")
      .map((word, index) => {
        if (exceptions.includes(word.toLowerCase()) && index !== 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  },
};

export default capitalize;
