import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import {
  BROWSE,
  UPDATE,
} from "../../../../services/redux/slices/administrator/employees";
import { useDispatch, useSelector } from "react-redux";
import { fullName, globalSearch } from "../../../../services/utilities";
import { Search } from "../../../widgets/search";
import Modal from "./modal";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";
import Role from "./role";
import Spinner from "../../../widgets/spinner";
import Swal from "sweetalert2";
export default function Employees() {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ employees }) => employees),
    [show, setShow] = useState(false),
    [employees, setEmployees] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState(""),
    [showRole, setShowRole] = useState(false),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);
  const toggleRole = () => setShowRole(!showRole);
  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setEmployees(collections);
  }, [collections, setEmployees]);

  const handleSearch = (e) => {
    e.preventDefault();

    setEmployees(globalSearch(collections, search));

    setDidSearch(true);
  };

  const handleBanned = (hasBanned, _id) => {
    const title = `${hasBanned ? "active" : "banned"}`;
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${title} this employee!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${title} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(UPDATE({ token, data: { _id, wasBanned: !hasBanned } }));
        Swal.fire({
          title: "Suceessfully!",
          text: `Your employee has been ${title}.`,
          icon: "success",
        });
      }
    });
  };
  return (
    <MDBCard>
      <MDBCardBody>
        <Search
          title={"Employee List"}
          toggleCreate={toggle}
          icon="users"
          didSearch={didSearch}
          collections={collections}
          setContainer={setEmployees}
          handleSearch={handleSearch}
          setDidSearch={setDidSearch}
          setSearch={setSearch}
          search={search}
        />
        {!isLoading ? (
          <>
            <MDBTable striped responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  handlePagination(employees, page, maxPage).map(
                    (
                      { role, fullName: name, email, _id, wasBanned },
                      index
                    ) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center">{fullName(name)}</td>
                        <td className="text-center">{email}</td>
                        <td className="text-center">
                          {wasBanned ? "Banned" : "Active"}
                        </td>
                        <td className="text-center">{role}</td>
                        <td className="text-center">
                          <MDBBtnGroup>
                            <MDBBtn
                              size="sm"
                              rounded
                              color="primary"
                              onClick={() => {
                                setSelected({ role, _id });
                                toggleRole();
                              }}
                            >
                              <MDBIcon icon="key" />
                            </MDBBtn>
                            <MDBBtn
                              size="sm"
                              rounded
                              color={wasBanned ? "danger" : "success"}
                              onClick={() => handleBanned(wasBanned, _id)}
                            >
                              <MDBIcon
                                icon={wasBanned ? "user-slash" : "user-shield"}
                              />
                            </MDBBtn>
                          </MDBBtnGroup>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Records.
                    </td>
                  </tr>
                )}
              </tbody>
            </MDBTable>
            <PaginationButtons
              page={page}
              setPage={setPage}
              array={employees}
              max={maxPage}
              title="Employee"
            />
          </>
        ) : (
          <Spinner />
        )}
      </MDBCardBody>
      <Modal
        collections={collections}
        show={show}
        toggle={toggle}
        selected={{}}
        setShow={setShow}
        willCreate={true}
      />
      <Role show={showRole} toggle={toggleRole} selected={selected} />
    </MDBCard>
  );
}
