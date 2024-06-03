import React from "react";
import { MDBIcon } from "mdbreact";
import { categories } from "../../../../services/fakeDb";

export const Header = () => {
  return (
    <>
      <div>
        <h6 style={{ fontWeight: 500 }}>
          <MDBIcon icon="store" className="mr-3" /> Products
        </h6>
      </div>
      <div>
        <select
          className="form-control"
          style={{ height: 42, borderRadius: 15, width: "400px" }}
        >
          {categories.map((categorie, index) => (
            <option value={categorie} key={index}>
              {categorie}
            </option>
          ))}
        </select>
      </div>
      <div className="cashier-search-cotaniner ">
        <form className="cashier-search">
          <input placeholder="Search..." autoCorrect="off" spellCheck={false} />
          <button type="submit">
            <MDBIcon icon={"search"} className="search-icon" />
          </button>
        </form>
      </div>
    </>
  );
};
