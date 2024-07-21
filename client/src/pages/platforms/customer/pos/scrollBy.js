const ITEMS_PER_PAGE = 6;

const scrollBy = (
  scrollContainerRef,
  collections,
  currentIndex,
  setCurrentIndex,
  direction
) => {
  const container = scrollContainerRef.current;
  if (direction === "left") {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
    setCurrentIndex(Math.max(0, currentIndex - ITEMS_PER_PAGE));
  } else if (direction === "right") {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    setCurrentIndex(
      Math.min(
        collections.length - ITEMS_PER_PAGE,
        currentIndex + ITEMS_PER_PAGE
      )
    );
  }
};

export default scrollBy;
