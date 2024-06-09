import React, { useCallback, useEffect, useState } from "react";
import {
  MDBCol,
  MDBRow,
  MDBPageItem,
  MDBPagination,
  MDBPageNav,
} from "mdbreact";

const PaginationButtons = ({
  title,
  page = 1,
  setPage,
  max, // max of page
  array = [],
  displayedButtons = 5,
}) => {
  const maxCount = Math.ceil(array.length / max);
  const countButtons =
    displayedButtons > maxCount ? maxCount : displayedButtons;

  const [activeBtn, setActiveBtn] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [isCreate, setIsCreate] = useState(false);
  useEffect(() => {
    setEndIndex(countButtons);
  }, [countButtons]);

  const handleNextBtn = useCallback(
    (page) => {
      setActiveBtn(page);
      setPage(page);
    },
    [setPage, setActiveBtn]
  );
  useEffect(() => {
    if (endIndex) {
      if (page > endIndex) {
        if (isCreate) {
          setStartIndex((prev) => prev + countButtons);
        } else {
          setStartIndex(1 + countButtons);
          setIsCreate(true);
        }

        setEndIndex((prev) => prev + countButtons);
      } else if (isCreate) {
        if (page < startIndex) {
          setStartIndex((prev) => prev - countButtons);
          setEndIndex((prev) => prev - countButtons);
        }
      }
    }

    handleNextBtn(page);
  }, [countButtons, page, endIndex, isCreate, startIndex, handleNextBtn]);

  const handleButtons = () => {
    const buttons = [];

    if (page <= countButtons) {
      for (let i = 1; i <= countButtons; i++) {
        buttons.push(
          <MDBPageItem key={i} active={isActive(i, activeBtn)}>
            <MDBPageNav className="page-link" onClick={() => handleNextBtn(i)}>
              {countButtons === i ? (page < countButtons ? i : page) : i}
            </MDBPageNav>
          </MDBPageItem>
        );
      }
    } else {
      const endLoop = endIndex > maxCount ? maxCount : endIndex;

      for (let i = startIndex; i <= endLoop; i++) {
        buttons.push(
          <MDBPageItem key={i} active={i === activeBtn}>
            <MDBPageNav className="page-link" onClick={() => handleNextBtn(i)}>
              {i}
            </MDBPageNav>
          </MDBPageItem>
        );
      }
    }

    return buttons;
  };

  const isActive = (index, active) => {
    var result = false;

    if (countButtons === index) {
      if (page < countButtons) {
        result = index === active;
      } else {
        result = page === active;
      }
    } else {
      result = active === index;
    }
    return result;
  };

  return (
    <MDBRow className="mt-5 d-flex align-items-center">
      {array.length !== 0 && (
        <>
          <MDBCol>
            <h6>
              Total of ({array.length}) {title}
              {array.length > 1 ? "s" : ""}
            </h6>
          </MDBCol>
          <MDBCol className="d-flex justify-content-end" md="6">
            <MDBPagination circle className="mb-5">
              <MDBPageItem disabled={activeBtn === 1}>
                <MDBPageNav
                  className="page-link"
                  onClick={() => setPage(activeBtn - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </MDBPageNav>
              </MDBPageItem>

              {handleButtons()}

              <MDBPageItem disabled={page === maxCount}>
                <MDBPageNav
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </MDBPageNav>
              </MDBPageItem>
            </MDBPagination>
          </MDBCol>
        </>
      )}
    </MDBRow>
  );
};

export default PaginationButtons;
