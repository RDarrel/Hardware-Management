import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/administrator/auditTrails";
import {
  formattedDate,
  fullName,
  globalSearch,
} from "../../../../services/utilities";
import { Header } from "../report/header";
import formattedTotal from "../../../../services/utilities/forattedTotal";
import Spinner from "../../../widgets/spinner";
import handlePagination from "../../../widgets/pagination";
import PaginationButtons from "../../../widgets/pagination/buttons";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AuditTrails = () => {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading = false } = useSelector(
      ({ auditTrails }) => auditTrails
    ),
    [audits, setAudits] = useState([]),
    [baseAudits, setBaseAudits] = useState([]),
    [search, setSearch] = useState(""),
    [from, setFrom] = useState(new Date()),
    [to, setTo] = useState(new Date()),
    [page, setPage] = useState(1),
    dispatch = useDispatch();

  // Filter the search results
  useEffect(() => {
    if (search && audits.length > 0) {
      const filtered = globalSearch([...audits], search);
      setBaseAudits(filtered);
    } else {
      setBaseAudits(audits);
    }
  }, [search, audits]);

  // Fetch data

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  const dateByNumber = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const reportTitle = `Audit Trails Report - ${formattedDate(
      from
    )} to ${formattedDate(to)}`;

    const textWidth = doc.getTextWidth(reportTitle);
    const xPosition = (pageWidth - textWidth) / 2;

    doc.setFontSize(16);
    doc.text(reportTitle, xPosition, 40);

    const tableColumn = [
      "Invoice No.",
      "Date & Time",
      "Employee",
      "Role",
      "Action",
      "Amount",
      "Description",
    ];

    const tableRows = baseAudits.map((audit) => [
      audit.invoice_no || "--",
      dateByNumber(audit.createdAt),
      fullName(audit.employee?.fullName) || "--",
      audit.employee?.role === "ADMINISTRATOR"
        ? "ADMIN"
        : audit.employee?.role || "--",
      audit.action,
      audit.amount ? `${formattedTotal(audit.amount)}` : "--",
      audit.description,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 8 },
      headStyles: { fillColor: [0, 0, 128] },
      columnStyles: {
        0: { cellWidth: 80 }, // Invoice No.
        1: { cellWidth: 100 }, // Date & Time
        2: { cellWidth: 150 }, // Employee
        3: { cellWidth: 100 }, // Role
        4: { cellWidth: 100 }, // Action
        5: { cellWidth: 100 }, // Amount
        6: { cellWidth: 200 }, // Description
      },
      margin: { top: 50, left: 5, right: 60 },
    });

    doc.save("Audit_Trails_Report.pdf");
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <MDBBtn size="sm" onClick={() => exportToPDF()} className="">
          <MDBIcon icon="file-excel" className="mr-2" />
          Export In PDF
        </MDBBtn>
      </div>
      <MDBCard>
        <MDBCardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center mr-5">
                <MDBIcon icon="map" style={{ color: "blue" }} size="2x" />
                <h4 className="mt-2 ml-2">Audit Trails</h4>
              </div>
              <div className="mt-3">
                <Header
                  collections={collections}
                  isEmployees={true}
                  isAudit={true}
                  isSalesReport={true}
                  setFilteredData={setAudits}
                  setBaseFrom={setFrom}
                  setBaseTo={setTo}
                />
              </div>
            </div>
            <input
              type="search"
              placeholder="Search.."
              className="form-control w-25 mt-1"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
          </div>
          {!isLoading ? (
            <>
              <MDBTable striped bordered className="mt-1">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Date & Time</th>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Action </th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {baseAudits.length > 0 ? (
                    handlePagination(baseAudits, page, maxPage).map(
                      (audit, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 400 }}>
                            {audit.invoice_no ? audit.invoice_no : "--"}
                          </td>
                          <td style={{ fontWeight: 400 }}>
                            {formattedDate(audit.createdAt)}
                          </td>
                          <td style={{ fontWeight: 400 }}>
                            {fullName(audit.employee?.fullName)}
                          </td>
                          <td style={{ fontWeight: 400 }}>
                            {audit.employee?.role}
                          </td>
                          <td style={{ fontWeight: 400 }}>{audit.action}</td>
                          <td style={{ fontWeight: 400 }}>
                            {audit.amount
                              ? `₱${formattedTotal(audit.amount)}`
                              : "--"}
                          </td>
                          <td style={{ fontWeight: 400 }}>
                            <div className="d-flex align-items-center mt-2">
                              <h6 style={{ maxWidth: "300px" }}>
                                {audit.description}
                              </h6>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No Record
                      </td>
                    </tr>
                  )}
                </tbody>
              </MDBTable>
              <PaginationButtons
                title={"Audit Trail"}
                page={page}
                setPage={setPage}
                max={maxPage}
                array={baseAudits}
              />
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default AuditTrails;
