import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBSwitch,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, globalSearch } from "../../../../../services/utilities";
import {
  BROWSE,
  DESTROY,
  VARIATION_UPDATE,
} from "../../../../../services/redux/slices/administrator/productManagement/products";
import Swal from "sweetalert2";
import ProductInformation from "../../../../../components/product/index";
import "./product.css";
import { Table } from "./table";
import { Search } from "../../../../widgets/search";
import Spinner from "../../../../widgets/spinner";

const Products = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
        Swal.fire({
          title: "Deleted!",
          text: "Your Product has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleRowSpan = (product, variant) => {
    if (variant === "variant2") {
      return product.variations.reduce(
        (total, variation) =>
          total +
          variation.options.length * (variation.options[0].prices?.length || 0),
        0
      );
    }

    return product.variations.reduce(
      (total, variation) => total + variation.options.length,
      0
    );
  };

  const handleDiasableVariant = (
    value,
    { product, optionID, variantID, priceID }
  ) => {
    const action = value ? "enable" : "disable";
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${action} this variant!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          VARIATION_UPDATE({
            token,
            data: {
              productID: product._id,
              optionID,
              variantID,
              isDisable: !value,
              priceID,
              has2Variant: product.has2Variant,
            },
          })
        );
        Swal.fire({
          title: "Success!",
          text: `Your Variation has been ${action}.`,
          icon: "success",
        });
      }
    });
  };

  const getProductImg = (product) => (
    <img
      src={`${ENDPOINT}/assets/products/${product._id}/${product.media?.product[0].label}.jpg`}
      alt={product.name}
      className="mr-2"
      style={{ width: "50px", height: "50px" }}
    />
  );

  const handleUpdate = (product) => {
    setSelected(product);
    setShow(true);
    setWillCreate(false);
  };

  const handleTableData = (
    key,
    product,
    isFirstRow,
    { variation = {}, option, actionFor, price }
  ) => {
    const has2Variant = product.has2Variant;
    const vrDisable = {
      product,
      variantID: variation._id,
      optionID: option._id,
      priceID: has2Variant ? price._id : "",
    };

    const isDisable = has2Variant ? price.disable : option.disable;
    const variantName = `${option.name} ${has2Variant ? `,${price.name}` : ""}`;
    return (
      <tr key={key} className={isFirstRow ? "border-top" : ""}>
        {isFirstRow ? (
          <>
            <td rowSpan={handleRowSpan(product, actionFor)}>
              <div className="d-flex align-items-center">
                {getProductImg(product)}
                <h6
                  className="text-truncate"
                  style={{
                    maxWidth: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </h6>
              </div>
            </td>
          </>
        ) : null}
        <td className="d-flex align-items-center " style={{ border: "none" }}>
          <MDBSwitch
            labelLeft=""
            labelRight=""
            checked={isDisable ? false : true}
            onChange={({ target }) =>
              handleDiasableVariant(target.checked, vrDisable)
            }
          />
          <h6> {variantName}</h6>
        </td>
        <td>
          <h6>
            ₱
            {has2Variant
              ? price?.capital?.toLocaleString()
              : option?.capital?.toLocaleString()}
          </h6>
        </td>
        <td>
          <h6>
            ₱
            {has2Variant
              ? price?.srp?.toLocaleString()
              : option?.srp?.toLocaleString()}
          </h6>
        </td>

        <td>
          <h6>
            ₱
            {has2Variant
              ? Number(price.srp - price.capital).toLocaleString()
              : Number(option.srp - option.capital).toLocaleString()}
          </h6>
        </td>

        {isFirstRow && (
          <td className="text-center">
            <MDBBtnGroup>
              <MDBBtn
                size="sm"
                rounded
                color="danger"
                onClick={() => handleDelete(product._id)}
              >
                <MDBIcon icon="trash" />
              </MDBBtn>
              <MDBBtn
                rounded
                size="sm"
                color="primary"
                onClick={() => handleUpdate(product)}
              >
                <MDBIcon icon="pencil-alt" />
              </MDBBtn>
            </MDBBtnGroup>
          </td>
        )}
      </tr>
    );
  };

  const toggleCreate = () => setShow(!show);
  const [search, setSearch] = useState(""),
    [didSearch, setDidSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setProducts(globalSearch(collections, search));
    setDidSearch(true);
  };

  return (
    <>
      {!show ? (
        <>
          <MDBCard>
            <MDBCardBody>
              <Search
                toggleCreate={toggleCreate}
                title="Product List"
                icon="award"
                search={search}
                setDidSearch={setDidSearch}
                didSearch={didSearch}
                collections={collections}
                setContainer={setProducts}
                handleSearch={handleSearch}
                setSearch={setSearch}
              />
              {!isLoading ? (
                <Table
                  products={products}
                  handleTableData={handleTableData}
                  getProductImg={getProductImg}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
                />
              ) : (
                <Spinner />
              )}
            </MDBCardBody>
          </MDBCard>
        </>
      ) : (
        <ProductInformation
          collections={collections}
          setIsViewProductInformation={setShow}
          selected={selected}
          willCreate={willCreate}
          setWillCreate={setWillCreate}
          setSelected={setSelected}
        />
      )}
    </>
  );
};

export default Products;
