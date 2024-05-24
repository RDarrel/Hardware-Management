import React from "react";
import { MDBTable } from "mdbreact";
import { handlePagination } from "../../services/utilities";
import { useSelector } from "react-redux";

export default function Table({
  isLoading,
  title,
  array,
  search,
  selectedAll,
  setSelectedAll,
  setSelected,
  tableHeads,
  page,
  tableBodies,
  selected,
  handleToggleSelect,
}) {
  const { maxPage } = useSelector(({ auth }) => auth);

  return (
    <MDBTable responsive hover>
      <thead>
        <tr>
          <th className="pb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id={title}
              disabled={isLoading || array.length < 1}
              checked={selectedAll}
              onChange={e => {
                setSelectedAll(e.target.checked);
                setSelected(e.target.checked ? array : []);
              }}
            />
            <label htmlFor={title} className="form-check-label label-table" />
          </th>
          {tableHeads?.map((_thead, index) => {
            const {
              _text = "",
              _style = {},
              _className = "",
              _condition,
            } = _thead;

            const element = (
              <th
                style={_style}
                key={`${title}-thead-${index}`}
                className={`th-lg ${_className}`}
              >
                {_text}
              </th>
            );

            //check if a condition is declared and met
            if (_condition && !_condition()) {
              return null;
            }
            return element;
          })}
        </tr>
      </thead>

      <tbody>
        {array.length > 0 ? (
          handlePagination(array, page, maxPage).map((item, index) => {
            const selectedIndex = selected.findIndex(e => e._id === item._id);
            const isSelected = selectedIndex > -1;

            return (
              <tr key={`${title}-tbody-${index}`}>
                <th scope="row" className="pb-2">
                  <input
                    disabled={isLoading}
                    className="form-check-input"
                    type="checkbox"
                    id={`${item._id}-${index}`}
                    checked={isSelected}
                    onChange={() =>
                      handleToggleSelect(isSelected, selectedIndex, item)
                    }
                  />
                  <label
                    htmlFor={`${item._id}-${index}`}
                    className="label-table"
                  />
                </th>
                {tableBodies?.map((_tbody, _index) => {
                  const {
                    _key = "",
                    _style = {},
                    _className = "",
                    _condition,
                    _format,
                  } = _tbody;

                  const key = item[_key] || <i>Key not found</i>;

                  const element = (
                    <td
                      key={`${title}-tcard-${_index}`}
                      style={_style}
                      className={_className}
                    >
                      {_format ? _format(key) : key}
                    </td>
                  );

                  if (_condition && !_condition()) {
                    return null;
                  }
                  return element;
                })}
              </tr>
            );
          })
        ) : (
          <tr className="text-center">
            <td colSpan={tableBodies.length + 1}>
              <i>No {search ? "matching" : "recent"} records </i>
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
