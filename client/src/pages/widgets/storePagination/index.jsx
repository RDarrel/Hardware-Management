import React from "react";
import {
  MDBIcon,
  MDBRow,
  MDBPagination,
  MDBPageItem,
  MDBPageNav,
} from "mdbreact";
export const StorePagination = ({
  pageNumbers,
  handlePageChange,
  currentPage,
}) => {
  return (
    <MDBRow className="d-flex justify-content-center mt-3">
      <MDBPagination>
        <MDBPageItem disabled={currentPage === 1}>
          <MDBPageNav
            aria-label="Previous"
            onClick={() =>
              currentPage > 1 ? handlePageChange(currentPage - 1) : null
            }
            size="lg"
          >
            <MDBIcon icon="angle-left" size="lg" />
          </MDBPageNav>
        </MDBPageItem>
        {pageNumbers.map((number) => (
          <MDBPageItem key={number} active={number === currentPage}>
            <MDBPageNav onClick={() => handlePageChange(number)} size="lg">
              {number}
            </MDBPageNav>
          </MDBPageItem>
        ))}
        <MDBPageItem disabled={currentPage === pageNumbers.length}>
          <MDBPageNav
            aria-label="Next"
            onClick={() =>
              currentPage < pageNumbers.length
                ? handlePageChange(currentPage + 1)
                : null
            }
            size="lg"
          >
            <MDBIcon icon="angle-right" size="lg" />
          </MDBPageNav>
        </MDBPageItem>
      </MDBPagination>
    </MDBRow>
  );
};
