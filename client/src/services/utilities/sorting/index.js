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

      console.log(sortedCategory);

      const newActiveCategory = sortedCategory.find(
        ({ _id }) => _id === activeCategory
      )?._id;
      console.log(newActiveCategory);
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

  products: (products, setProducts = () => {}) => {
    const sortedBySold = products?.slice().sort((a, b) => b.sold - a.sold);
    setProducts(sortedBySold || []);
  },
};

export default sortBy;
