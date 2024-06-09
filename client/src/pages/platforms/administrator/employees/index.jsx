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
import { fullName } from "../../../../services/utilities";
import { Search } from "../../../widgets/search";
import Modal from "./modal";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";
export default function Employees() {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ employees }) => employees),
    [show, setShow] = useState(false),
    [employees, setEmployees] = useState([]),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setEmployees(collections);
  }, [collections, setEmployees]);

  return (
    <MDBCard>
      <MDBCardBody>
        <Search title={"Employee List"} toggleCreate={toggle} />
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
                ({ role, fullName: name, email }, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fullName(name)}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                    <td className="text-center">
                      <MDBBtnGroup>
                        <MDBBtn size="sm" rounded color="primary">
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
              <tr></tr>
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
      </MDBCardBody>
      <Modal
        show={show}
        toggle={toggle}
        selected={{}}
        setShow={setShow}
        willCreate={true}
      />
    </MDBCard>
  );
}
