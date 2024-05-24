import React from "react";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";

export default function Actions({
  isLoading,
  search,
  title,
  actions,
  handleSelectReset,
  selected,
  handleSearch,
  setSearch,
  setSelected,
  arrayLength,
  disableSearch,
}) {
  const { addToast } = useToasts();

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="white-text mx-3">
        {arrayLength}&nbsp;
        {search ? "Matching" : title}
        {search && (
          <>
            &nbsp;item(s) with <b>{search}</b>
          </>
        )}
      </span>
      <div className="text-right">
        {actions?.map((action, index) => {
          const {
            _icon = "",
            _style = {},
            _className = "",
            _condition,
            _function = () => {},
            _shouldReset = false,
            _haveSelect = false,
            _allowMultiple = true,
            _disabledOnSearch = false,
          } = action;

          const element = (
            <MDBBtn
              key={`${title}-actions-${index}`}
              style={_style}
              onClick={() => {
                if (_haveSelect) {
                  if (selected.length > 0) {
                    if (_allowMultiple) {
                      _function(selected);
                    } else {
                      if (selected.length === 1) {
                        _function(selected[0]);
                      } else {
                        addToast("Please select only one item.", {
                          appearance: "info",
                        });
                      }
                    }
                  } else {
                    addToast("Please select an item first.", {
                      appearance: "info",
                    });
                  }
                } else {
                  _function();
                }

                if (_shouldReset) {
                  handleSelectReset();
                }
              }}
              disabled={
                isLoading || (_disabledOnSearch && search ? true : false)
              }
              outline
              color="white"
              rounded
              size="sm"
              className={`px-2 ${_className}`}
            >
              <MDBIcon icon={_icon} className="mt-0" />
            </MDBBtn>
          );

          if (_condition && !_condition()) {
            return null;
          }
          return element;
        })}
        {!disableSearch && (
          <MDBBtn
            disabled={isLoading}
            onClick={async () => {
              if (search) {
                setSearch("");

                handleSearch(false);
              } else {
                const { value: _search } = await Swal.fire({
                  title: "What are you looking for?",
                  text: "Provide a keyword and we will find it for you.",
                  icon: "question",
                  input: "text",
                  confirmButtonText: "Search",
                  inputValidator: value => {
                    if (!value) {
                      return "You need to write something!";
                    }
                  },
                });

                if (_search) {
                  const _key = _search.toUpperCase();

                  setSearch(_key);
                  setSelected([]);

                  handleSearch(true, _key);
                }
              }
            }}
            outline
            color="white"
            rounded
            size="sm"
            className="px-2"
          >
            <MDBIcon icon={search ? "times" : "search"} className="mt-0" />
          </MDBBtn>
        )}
      </div>
    </MDBView>
  );
}
