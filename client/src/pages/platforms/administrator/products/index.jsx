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
import { ENDPOINT } from "../../../../services/utilities";
import {
  BROWSE,
  DESTROY,
  VARIATION_UPDATE,
} from "../../../../services/redux/slices/administrator/products";
import Swal from "sweetalert2";
import Modal from "./modal";
import ProductInformation from "../../../../components/product/index";
import View from "./view";
import "./product.css";
import { Table } from "./table";
import { Search } from "../../../widgets/search";

const Products = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    [products, setProducts] = useState([]),
    [isView, setIsView] = useState(false),
    [selected, setSelected] = useState({}),
    [isViewProductInformation, setIsViewProductInformation] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    dispatch = useDispatch();

  const toggleView = () => setIsView(!isView);

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
      style={{ width: "80px" }}
    />
  );

  const handleUpdate = (product) => {
    setSelected(product);
    setIsViewProductInformation(true);
    setWillCreate(false);
  };

  const handleTableData = (
    key,
    product,
    isFirstRow,
    indexProduct,
    { variation, option, actionFor, price }
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
              {indexProduct + 1}
            </td>
            <td rowSpan={handleRowSpan(product, actionFor)}>
              <div className="d-flex align-items-center">
                {getProductImg(product)}
                <h5 className="text-truncate"> {product.name}</h5>
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
          <h5> {variantName}</h5>
        </td>
        <td>
          <h5>₱{has2Variant ? price.srp : option.srp}</h5>
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

  return (
    <>
      {!isViewProductInformation ? (
        <>
          <MDBCard>
            <MDBCardBody>
              <Search
                setShow={setIsViewProductInformation}
                title="Product List"
              />
              <Table
                products={products}
                handleTableData={handleTableData}
                getProductImg={getProductImg}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            </MDBCardBody>
          </MDBCard>

          <View isView={isView} toggleView={toggleView} selected={selected} />
          <Modal
            toggle={() => {
              if (!willCreate) {
                setWillCreate(true);
                setSelected({});
              }
              setShow(false);
            }}
            show={show}
            willCreate={willCreate}
            selected={selected}
          />
        </>
      ) : (
        <ProductInformation
          setIsViewProductInformation={setIsViewProductInformation}
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
