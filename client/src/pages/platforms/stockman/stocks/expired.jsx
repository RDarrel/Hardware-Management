import React, { useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBBtn,
} from "mdbreact";
import {
  ENDPOINT,
  formattedDate,
  variation,
} from "../../../../services/utilities";
import { REMOVE_EXPIRED } from "../../../../services/redux/slices/stockman/stocks";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";
export default function Expired({
  show,
  toggle,
  expiredProducts = [],
  setExpiredProducts = () => {},
}) {
  const { auth, token, maxPage } = useSelector(({ auth }) => auth),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const handleRemove = (expired) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you  want to remove this product? .",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const { product } = expired;
        const { isPerKilo = false } = product;
        dispatch(
          REMOVE_EXPIRED({
            token,
            data: {
              ...expired,
              removeBy: auth._id,
              removeDate: new Date(),
              quantity: isPerKilo ? expired.kiloStock : expired.quantityStock,
            },
          })
        );
        const _expiredProducts = [...expiredProducts];
        const index = _expiredProducts.findIndex(
          ({ _id }) => _id === expired._id
        );

        _expiredProducts.splice(index, 1);
        if (_expiredProducts.length === 0) {
          toggle();
        }

        setExpiredProducts(_expiredProducts);
        Swal.fire(
          "Removed!",
          "The product has been successfully removed.",
          "success"
        );
      }
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clipboard-list" className="mr-2" />
        Expired Products List
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBTable>
          <thead>
            <tr>
              <th>Product</th>
              <th className="text-center">Quantity/Kilo</th>
              <th className="text-center">Expiration Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {handlePagination(expiredProducts, page, maxPage).map((obj) => {
              const { product, _id } = obj;
              const { media, isPerKilo = false } = product;
              const img = `${ENDPOINT}/assets/products/${product._id}/${media.product[0].label}.jpg`;
              return (
                <tr key={_id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={img}
                        alt={product.name}
                        className="mr-2"
                        style={{
                          width: "50px",
                          borderRadius: "4px",
                          height: "50px",
                        }}
                      />
                      <div>
                        <h6
                          className="text-truncate"
                          style={{
                            maxWidth: "350px",
                            fontWeight: "400",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            marginBottom: "-15px",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h6>
                        {product.hasVariant && (
                          <div className="d-flex align-items-center">
                            <span className="mr-1">Variant:</span>
                            <span>
                              {variation.name(obj, product.variations)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="font-weight-bold text-center">
                    {isPerKilo
                      ? `${obj.kiloStock} kg`
                      : `${obj.quantityStock} Pcs`}
                  </td>
                  <td className="text-center font-weight-bold">
                    {formattedDate(obj.expirationDate)}
                  </td>
                  <td className="text-center">
                    <MDBBtn
                      size="sm"
                      color="info"
                      title="Remove"
                      onClick={() => handleRemove(obj)}
                    >
                      <MDBIcon icon="share" />
                    </MDBBtn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </MDBTable>
        <PaginationButtons
          mt={0}
          page={page}
          setPage={setPage}
          max={maxPage}
          array={expiredProducts}
          title={"Expired Product"}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
