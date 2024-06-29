import React, { useEffect, useRef, useState } from "react";
import { categories } from "../../../../../services/fakeDb";
import { MDBBtn } from "mdbreact";

const Categories = () => {
  const carouselRef = useRef(null);
  const [grabbed, setGrabbed] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = 5;

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
        <MDBBtn size="sm" color="primary">
          All
        </MDBBtn>
        {categories.map((category, index) => (
          <MDBBtn
            key={index}
            size="sm"
            outline
            color="primary"
            className="category-btn"
          >
            {category}
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
