import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { Search } from "../../../../widgets/search";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  DESTROY,
} from "../../../../../services/redux/slices/administrator/productManagement/materials";
import Swal from "sweetalert2";
import Modal from "./modal";
import handlePagination from "../../../../widgets/pagination";
import PaginationButtons from "../../../../widgets/pagination/buttons";
import { globalSearch } from "../../../../../services/utilities";
import Spinner from "../../../../widgets/spinner";

const Materials = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ materials }) => materials),
    [materials, setMaterials] = useState([]),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({}),
    [page, setPage] = useState(1),
    [show, setShow] = useState(false),
    [didSearch, setDidSearch] = useState(false),
    [search, setSearch] = useState(""),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setMaterials(collections);
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

  const handleSearch = (e) => {
    e.preventDefault();

    setMaterials(globalSearch(collections, search));

    setDidSearch(true);
  };
  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <Search
            title={"Material List"}
            icon="toolbox"
            toggleCreate={toggle}
            search={search}
            didSearch={didSearch}
            setDidSearch={setDidSearch}
            setSearch={setSearch}
            setContainer={setMaterials}
            handleSearch={handleSearch}
            collections={collections}
          />
          {!isLoading ? (
            <>
              <MDBTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.length > 0 ? (
                    handlePagination(materials, page, maxPage).map(
                      (material, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center font-weight-bolder">
                            {material.name}
                          </td>
                          <td className="text-center">
                            <MDBBtnGroup>
                              <MDBBtn
                                size="sm"
                                rounded
                                color="danger"
                                onClick={() => handleDelete(material._id)}
                              >
                                <MDBIcon icon="trash" />
                              </MDBBtn>
                              <MDBBtn
                                size="sm"
                                rounded
                                color="primary"
                                onClick={() => {
                                  setWillCreate(false);
                                  setSelected(material);
                                  toggle();
                                }}
                              >
                                <MDBIcon icon="pencil-alt" />
                              </MDBBtn>
                            </MDBBtnGroup>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No Records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </MDBTable>
              <PaginationButtons
                array={materials}
                page={page}
                setPage={setPage}
                max={maxPage}
                title={"Material"}
              />
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
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
        collections={materials}
      />
    </>
  );
};

export default Materials;
