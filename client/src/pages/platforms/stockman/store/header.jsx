import React, { useEffect, useState } from "react";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";
// import { categories } from "../../../../services/fakeDb";
import CustomSelect from "../../../../components/customSelect";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/administrator/productManagement/category";
import sortBy from "../../../../services/utilities/sorting";

export const Header = ({
  setProducts,
  products,
  setCurrentPage,
  collections: collectionsProducts = [],
  didSearch = false,
  search,
  handleSearch = () => {},
  setContainer = () => {},
  setDidSearch = () => {},
  setSearch = () => {},
}) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [category, setCategory] = useState(""),
    [categories, setCategories] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    if (collections.length > 0) {
      sortBy.categories({
        categories: collections,
        products,
        setCategories,
      });
    }
  }, [collections, products]);

  useEffect(() => {
    if (category !== "all") {
      const _products = [...products];
      const filteredProducts = _products.filter(
        ({ category: c }) => c?._id === category
      );
      const sortedBySold = filteredProducts.sort((a, b) => b.sold - a.sold);
      setProducts(sortedBySold);
    } else {
      setProducts(products);
    }
    setCurrentPage(1);
  }, [category, products, setProducts, setCurrentPage]);

  return (
    <MDBRow
      className="d-flex align-items-center m-0 p-0"
      style={{ position: "relative" }}
    >
      <MDBCol md="2" className="d-flex justify-content-start">
        <h6 style={{ fontWeight: 500 }} className="mt-1">
          <MDBIcon icon="store" className="mr-2" /> Store
        </h6>
      </MDBCol>
      <MDBCol md="6" className="d-flex justify-content-center text-white ">
        <CustomSelect
          className="m-0 p-0 w-75 text-white customSelect"
          preValue={"Categories"}
          texts="name"
          values="_id"
          choices={[{ name: "All", _id: "all" }, ...categories]}
          inputClassName="text-white text-center"
          onChange={(value) => setCategory(value)}
        />
      </MDBCol>
      <MDBCol className="m-0 p-0 d-flex justify-content-end " md="4">
        <form className="cashier-search w-75" onSubmit={handleSearch}>
          <input
            placeholder="Search..."
            autoCorrect="off"
            spellCheck={false}
            required
            value={search}
            onChange={({ target }) => setSearch(target.value.toUpperCase())}
          />
          <button
            onClick={() => {
              if (!didSearch) return;
              setDidSearch(false);
              setSearch("");
              setContainer(collectionsProducts);
            }}
            type={didSearch ? "button" : "submit"}
          >
            <MDBIcon
              icon={didSearch ? "times" : "search"}
              className="search-icon"
            />
          </button>
        </form>
      </MDBCol>
    </MDBRow>
  );
};
