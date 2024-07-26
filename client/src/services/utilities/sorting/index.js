const calculateRelevance = (name, searchTerm) => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerName === lowerSearchTerm) {
    return 3;
  } else if (lowerName.startsWith(lowerSearchTerm)) {
    return 2;
  } else if (lowerName.includes(lowerSearchTerm)) {
    return 1;
  } else {
    return 0;
  }
};

const sortBy = {
  categories: ({
    categories = [],
    products = [],
    activeCategory = "",
    setCategories = () => {},
    setCategory = () => {},
  }) => {
    const _products = [...products];

    if (categories.length > 0 && _products.length > 0) {
      const categoryWithProducts = categories.map((c) => {
        const filteredProducts = _products.filter(
          ({ category }) => category?._id === c._id
        );
        return { ...c, products: filteredProducts };
      });

      const categoryWithSoldProduct = categoryWithProducts.map((c) => {
        const totalSoldInProducts = c.products.reduce(
          (acc, curr) => acc + (curr?.sold || 0),
          0
        );
        return { ...c, sold: totalSoldInProducts };
      });

      const sortedCategory = categoryWithSoldProduct.sort(
        (a, b) => b.sold - a.sold
      );

      const newActiveCategory = sortedCategory.find(
        ({ _id }) => _id === activeCategory
      )?._id;

      if (
        newActiveCategory &&
        newActiveCategory !== activeCategory &&
        activeCategory !== "all"
      ) {
        setCategory(newActiveCategory);
      } else {
        setCategory("");
      }

      setCategories(sortedCategory);
    }
  },

  activeCategory: (collections, activeCategory) => {
    return [...collections].sort((a, b) => {
      if (a._id === activeCategory && b._id !== activeCategory) {
        return -1;
      } else if (a._id !== activeCategory && b._id === activeCategory) {
        return 1;
      } else {
        return 0;
      }
    });
  },

  products: (products, setProducts = () => {}) => {
    const sortedBySold = products?.slice().sort((a, b) => b.sold - a.sold);
    setProducts(sortedBySold || []);
  },

  shuffle: (products = []) => {
    const array = [...products];
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  },

  relevance: (array, searchTerm) => {
    return [...array].sort((a, b) => {
      const relevanceA = calculateRelevance(a.name, searchTerm);
      const relevanceB = calculateRelevance(b.name, searchTerm);

      return relevanceB - relevanceA;
    });
  },
};

export default sortBy;
