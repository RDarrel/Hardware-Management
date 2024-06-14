import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBSwitch,
  MDBTable,
} from "mdbreact";

import { Search } from "../../../widgets/search";
import Modal from "./modal";
import {
  BROWSE,
  STATUS,
  DESTROY,
} from "../../../../services/redux/slices/administrator/suppliers";
import Swal from "sweetalert2";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";

const Suppliers = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ suppliers }) => suppliers),
    [suppliers, setSuppliers] = useState([]),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState({}),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setSuppliers(collections);
  }, [collections]);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this supplier!",
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
          text: "Your supplier has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleChangeStatus = (status, _id) => {
    const title = `${status ? "Active" : "Inactive"}`;
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${title} this supplier!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${title} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(STATUS({ token, data: { _id, status } }));
        Swal.fire({
          title: "Deleted!",
          text: `Your supplier has been ${title}.`,
          icon: "success",
        });
      }
    });
  };

  return (
    <MDBCard>
      <MDBCardBody>
        <Search
          title="Supplier List"
          toggleCreate={() => setShow(!show)}
          icon="hands-helping"
        />
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 &&
              handlePagination(suppliers, page, maxPage).map(
                (supplier, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{supplier.company}</td>
                    <td>{supplier.location}</td>
                    <td>{supplier.contact}</td>
                    <td className="text-center">
                      <MDBSwitch
                        labelLeft="Inactive"
                        labelRight="Active"
                        checked={supplier.status ? true : false}
                        onChange={({ target }) =>
                          handleChangeStatus(target.checked, supplier._id)
                        }
                      />
                    </td>
                    <td className="text-center">
                      <MDBBtnGroup>
                        <MDBBtn
                          color="danger"
                          size="sm"
                          rounded
                          onClick={() => handleDelete(supplier._id)}
                        >
                          <MDBIcon icon="trash" />
                        </MDBBtn>
                        <MDBBtn
                          color="primary"
                          size="sm"
                          rounded
                          onClick={() => {
                            setSelected(supplier);
                            setShow(true);
                            setWillCreate(false);
                          }}
                        >
                          <MDBIcon icon="pencil-alt" />
                        </MDBBtn>
                      </MDBBtnGroup>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </MDBTable>
        <PaginationButtons
          max={maxPage}
          page={page}
          array={suppliers}
          setPage={setPage}
          title={"Supplier"}
        />
      </MDBCardBody>
      <Modal
        show={show}
        toggle={() => {
          if (!willCreate) {
            setWillCreate(true);
            setSelected({});
          }
          setShow(false);
        }}
        selected={selected}
        willCreate={willCreate}
      />
    </MDBCard>
  );
};

export default Suppliers;
