import React from "react";
import { MDBIcon, MDBInputGroup } from "mdbreact";
import { categories } from "../../../../services/fakeDb";

export const Header = () => {
  return (
    <>
      <div>
        <h6 style={{ fontWeight: 500 }}>
          <MDBIcon icon="store" className="mr-2" /> Store
        </h6>
      </div>
      <div>
        <div className="input-group" style={{ width: "400px" }}>
          <div className="input-group-prepend">
            <span className="input-group-text">Category</span>
          </div>
          <select className="form-control" style={{ height: 42 }}>
            {categories.map((categorie, index) => (
              <option value={categorie} key={index}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
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
