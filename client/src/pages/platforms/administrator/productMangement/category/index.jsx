import React, { useEffect, useState } from "react";
import {
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBIcon,
  MDBBtn,
} from "mdbreact";
import { Search } from "../../../../widgets/search";
import {
  BROWSE,
  DESTROY,
} from "../../../../../services/redux/slices/administrator/productManagement/category";
import { useDispatch, useSelector } from "react-redux";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import Modal from "./modal";
import Swal from "sweetalert2";

const Category = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ category }) => category),
    [category, setCategory] = useState([]),
    [page, setPage] = useState(1),
    [willCreate, setWillCreate] = useState(true),
    [show, setShow] = useState(false),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setCategory(collections);
  }, [collections]);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category!",
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
          text: "Your category has been deleted.",
          icon: "success",
        });
      }
    });
  };
  return (
    <MDBCard>
      <MDBCardBody>
        <Search
          title={"Category"}
          icon="clone"
          toggleCreate={() => setShow(true)}
        />
        <MDBTable>
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">Name</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {category.length &&
              handlePagination(category, page, maxPage).map((obj, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-center">{obj.name}</td>
                  <td className="text-center">
                    <MDBBtnGroup>
                      <MDBBtn
                        color="danger"
                        size="sm"
                        rounded
                        onClick={() => handleDelete(obj._id)}
                      >
                        <MDBIcon icon="trash" />
                      </MDBBtn>
                      <MDBBtn
                        color="primary"
                        size="sm"
                        rounded
                        onClick={() => {
                          setSelected(obj);
                          setShow(true);
                          setWillCreate(false);
                        }}
                      >
                        <MDBIcon icon="pencil-alt" />
                      </MDBBtn>
                    </MDBBtnGroup>
                  </td>
                </tr>
              ))}
          </tbody>
        </MDBTable>
        <PaginationButtons
          page={page}
          setPage={setPage}
          max={maxPage}
          array={category}
          title={"Category"}
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

export default Category;
