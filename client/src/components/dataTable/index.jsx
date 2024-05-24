import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import Pagination from "../pagination";
import TableRowCount from "../pagination/rows";
import Table from "./table";
import Actions from "./actions";
import { useSelector } from "react-redux";

/**
 * An automatic DataTable.
 *
 * @component
 * @param {boolean} isLoading - Loading status.
 * @param {boolean} disableSearch - Disables search Button.
 * @param {boolean} toggleComponent - Toggles your custom component.
 * @param {JSX.Element} customComponent - Your custom component.
 * @param {string} title - Table Title.
 * @param {object[]} array - Collection of data that will be processed into the table body.
 * @param {object[]} actions - Action buttons that will be shown.
 * @example
 * const actions = [
 *   { _icon: "sync", _condition: () => {}, _className: "bg-danger", _style: { color: "red" }, _function: () => {}, _shouldReset: true, _haveSelect: true, _allowMultiple: false },
 * ];
 * @param {object[]} tableHeads - Array of Table Heads.
 * @example
 * const tableHeads = [
 *   { _text: "Delete", _condition: () => {}, _className: "bg-danger", _style: { color: "red" } },
 * ];
 * @param {object[]} tableBodies - Array of Table Bodies.
 * @example
 * const tableBodies = [
 *   { _key: "email", _condition: () => {}, _className: "bg-danger", _style: { color: "red" }, _format: () => {} },
 * ];
 * @param {function} handleSearch - Function to handle search.
 * @returns {JSX.Element} The rendered DataTable component.
 */
export default function DataTable({
  isLoading = false,
  title = "",
  array = [],
  actions = [],
  tableHeads = [],
  tableBodies = [],
  handleSearch = () => {},
  customComponent,
  toggleComponent = false,
  disableSearch = false,
}) {
  const [search, setSearch] = useState(""),
    [selected, setSelected] = useState([]),
    [selectedAll, setSelectedAll] = useState(false),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    { maxPage } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (array.length > 0) {
      let totalPages = Math.floor(array.length / maxPage);
      if (array.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [array, page, maxPage]);

  const handleSelectReset = () => {
    if (selected.length > 0) {
      setSelected([]);
    }

    if (selectedAll) {
      setSelectedAll(false);
    }
  };

  const handleToggleSelect = (status, index, item) => {
    const _selected = [...selected];

    if (status) {
      _selected.splice(index, 1);

      if (selectedAll) {
        setSelectedAll(false);
      }
    } else {
      _selected.push(item);

      if (array.length === _selected.length) {
        setSelectedAll(true);
      }
    }

    setSelected(_selected);
  };

  const handleBody = () => {
    if (customComponent && toggleComponent) {
      return customComponent;
    }

    return (
      <>
        <div style={{ minHeight: "300px" }}>
          <Table
            page={page}
            isLoading={isLoading}
            title={title}
            array={array}
            search={search}
            selectedAll={selectedAll}
            setSelectedAll={setSelectedAll}
            setSelected={setSelected}
            tableHeads={tableHeads}
            tableBodies={tableBodies}
            selected={selected}
            handleToggleSelect={handleToggleSelect}
          />
        </div>
        <TableRowCount />
        <Pagination
          isLoading={isLoading}
          total={totalPages}
          page={page}
          setPage={setPage}
        />
      </>
    );
  };

  return (
    <MDBCard narrow>
      <Actions
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        setSelected={setSelected}
        arrayLength={array.length}
        title={title}
        actions={actions}
        handleSelectReset={handleSelectReset}
        selected={selected}
        handleSearch={handleSearch}
        disableSearch={disableSearch}
      />
      <MDBCardBody className="pb-0">{handleBody()}</MDBCardBody>
    </MDBCard>
  );
}
