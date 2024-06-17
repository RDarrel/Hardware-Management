import React, { useRef } from "react";
import { categories } from "../../../../../services/fakeDb";
import { MDBBtn } from "mdbreact";
const Categories = () => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationFrameId = useRef(null);

  const onMouseDown = (e) => {
    const container = containerRef.current;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 3; // Scroll speed
      container.scrollLeft = scrollLeft.current - walk;
    });
  };

  const onMouseEnter = () => {
    const container = containerRef.current;
    container.style.cursor = "grab";
  };

  const onMouseLeave = () => {
    const container = containerRef.current;
    container.style.cursor = "auto"; // Optional: Change back to default cursor on leave
    if (!isDragging.current && animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };
  return (
    <div
      className="scrollable-buttons-container mt-2"
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MDBBtn size="sm" color="primary">
        All
      </MDBBtn>
      {categories.map((category, index) => (
        <MDBBtn
          key={index}
          size="sm"
          outline
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          color="primary"
          className="category-btn"
        >
          {category}
        </MDBBtn>
      ))}
    </div>
  );
};

export default Categories;
