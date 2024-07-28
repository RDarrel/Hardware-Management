import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/administrator/employees";
import { useDispatch, useSelector } from "react-redux";
import { fullName, globalSearch } from "../../../../services/utilities";
import { Search } from "../../../widgets/search";
import Modal from "./modal";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";
import Role from "./role";
import Spinner from "../../../widgets/spinner";
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  handlePagination(employees, page, maxPage).map(
                    ({ role, fullName: name, email, _id }, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{fullName(name)}</td>
                        <td>{email}</td>
                        <td>{role}</td>
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
                            <MDBBtn size="sm" rounded color="danger">
                              <MDBIcon icon="user-slash" />
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
