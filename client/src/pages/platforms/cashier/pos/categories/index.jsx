import React, { useCallback, useEffect, useRef, useState } from "react";
// import { categories } from "../../../../../services/fakeDb";
import { MDBBtn } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/administrator/productManagement/category";

const Categories = ({
  setProducts,
  collections: collectionsProducts = [],
  setPage,
}) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [categories, setCategories] = useState([]),
    [grabbed, setGrabbed] = useState(false),
    [activeCategory, setActiveCategory] = useState("all"),
    [startX, setStartX] = useState(null),
    [scrollLeft, setScrollLeft] = useState(0),
    [activeIndex, setActiveIndex] = useState(0),
    carouselRef = useRef(null),
    dispatch = useDispatch();

  const totalItems = 5;

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    const _products = [...collectionsProducts];
    if (collections.length > 0 && _products.length > 0) {
      const categoryWithProducts = collections.map((c) => {
        const filteredProducts = _products.filter(
          ({ category }) => category === c._id
        );
        return { ...c, products: filteredProducts };
      });

      const categoryWithSoldProduct = categoryWithProducts.map((c) => {
        const { products } = c;
        const totalSoldInProducts = products.reduce(
          (acc, curr) => (acc += curr?.sold || 0),
          0
        );
        return { ...c, sold: totalSoldInProducts };
      });

      const sortedCategory = categoryWithSoldProduct.sort(
        (a, b) => b.sold - a.sold
      );

      var newActiveIndexCategory = sortedCategory.find(
        ({ _id }) => _id === activeCategory
      )?._id;

      if (
        newActiveIndexCategory !== activeCategory &&
        activeCategory !== "all"
      ) {
        setActiveCategory(newActiveIndexCategory);
      }
      setCategories(sortedCategory);
    }
  }, [collections, collectionsProducts, activeCategory]);

  const handleSortedProducts = useCallback(
    (_products) => {
      const sortedBySold = _products?.slice().sort((a, b) => b.sold - a.sold);
      setProducts(sortedBySold || []);
    },
    [setProducts]
  );

  useEffect(() => {
    if (activeCategory !== "all") {
      const _products = [...collectionsProducts];
      const fiteredProductByCategory = _products.filter(
        ({ category: pc }) => pc === activeCategory
      );
      handleSortedProducts(fiteredProductByCategory);
    } else {
      handleSortedProducts(collectionsProducts);
    }
    setPage(1);
  }, [
    activeCategory,
    categories,
    collectionsProducts,
    setProducts,
    setPage,
    handleSortedProducts,
  ]);

  useEffect(() => {
    if (carouselRef.current) {
      const categoryIndex = categories.findIndex(
        ({ _id }) => _id === activeCategory
      );
      const indexToScroll = activeCategory === "all" ? 0 : categoryIndex + 1; // Compute the index to scroll to (+1 because of the "All" button)
      carouselRef.current.scrollLeft = indexToScroll * 100; // Adjust this value based on your button width or desired scroll position
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (!grabbed) return;
      setGrabbed(false);
      if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = "smooth";
      }
    };

    const handleMouseMove = (e) => {
      if (!grabbed) return;
      e.preventDefault();
      const currentRef = carouselRef.current;
      if (currentRef) {
        const x = e.pageX - currentRef.offsetLeft;
        const walk = (x - startX) * 2;
        currentRef.scrollLeft = scrollLeft - walk;
      }
    };

    const handleScroll = () => {
      const currentRef = carouselRef.current;
      if (currentRef) {
        const { scrollWidth, clientWidth } = currentRef;
        const newIndex = Math.round(
          (currentRef.scrollLeft / (scrollWidth - clientWidth)) *
            (totalItems - 1)
        );
        setActiveIndex(newIndex);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [grabbed, startX, scrollLeft]);

  const handleMouseDown = (e) => {
    setGrabbed(true);
    const currentRef = carouselRef.current;
    if (currentRef) {
      setStartX(e.pageX - currentRef.offsetLeft);
      setScrollLeft(currentRef.scrollLeft);
      currentRef.style.scrollBehavior = "auto";
    }
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.style.scrollBehavior = "smooth";
      currentRef.scrollLeft =
        (index / (totalItems - 1)) *
        (currentRef.scrollWidth - currentRef.clientWidth);
    }
  };

  const renderDots = () => {
    return Array.from({ length: totalItems }, (_, i) => (
      <span
        key={i}
        className={`dot ${i === activeIndex ? "active" : ""}`}
        onClick={() => handleDotClick(i)}
      />
    ));
  };

  return (
    <>
      <div
        className="scrollable-buttons-container mt-2"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
      >
        <MDBBtn
          size="sm"
          color="primary"
          onClick={() => setActiveCategory("all")}
          outline={activeCategory !== "all"}
        >
          All
        </MDBBtn>
        {categories.map((category, index) => (
          <MDBBtn
            key={index}
            size="sm"
            onClick={() => setActiveCategory(category._id)}
            outline={category._id !== activeCategory}
            color="primary"
            className="category-btn"
          >
            {category.name}
          </MDBBtn>
        ))}
      </div>
      {categories.length > 4 && (
        <div className="dots-container">{renderDots()}</div>
      )}
    </>
  );
};

export default Categories;
