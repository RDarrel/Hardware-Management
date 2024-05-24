import React from "react";
import { MDBPagination, MDBPageItem, MDBPageNav } from "mdbreact";
import Swal from "sweetalert2";

export default function Pagination({ total, setPage, page, isLoading }) {
  const handlePage = action => {
    if (action) {
      setPage(prev => prev + 1);
    } else {
      setPage(prev => prev - 1);
    }
  };

  const handleOverride = async () => {
    const { value: _page } = await Swal.fire({
      title: "Specify a number",
      input: "number",
      inputLabel: `Minimum is 1 and Maximum is ${total}`,
      inputPlaceholder: `Current page is #${page}.`,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }

        if (Number(value) < 1) {
          return "Cannot go lower than 1";
        }

        if (Number(value) > total) {
          return `Cannot go higher than ${total}`;
        }
      },
    });

    if (_page) {
      setPage(Number(_page));
    }
  };

  return (
    <MDBPagination circle className="my-4 float-right">
      <MDBPageItem
        disabled={isLoading || page <= 1}
        onClick={() => handlePage(false)}
      >
        <MDBPageNav className="page-link" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span className="sr-only">Previous</span>
        </MDBPageNav>
      </MDBPageItem>
      <MDBPageItem disabled={isLoading} active onClick={handleOverride}>
        <MDBPageNav className="page-link">{page}</MDBPageNav>
      </MDBPageItem>
      <MDBPageItem
        onClick={() => handlePage(true)}
        disabled={isLoading || page >= total}
      >
        <MDBPageNav className="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span className="sr-only">Next</span>
        </MDBPageNav>
      </MDBPageItem>
    </MDBPagination>
  );
}
