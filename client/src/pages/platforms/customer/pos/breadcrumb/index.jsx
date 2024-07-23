import React from "react";
import { MDBBreadcrumb, MDBBreadcrumbItem } from "mdbreact";
import capitalize from "../../../../../services/utilities/capitalize";
const BreadCrumb = ({
  selected,
  handleSideBar,
  sideBarActive,
  activeCategory,
}) => {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <MDBBreadcrumb>
            <MDBBreadcrumbItem>
              <button
                className="btn-link-style"
                onClick={() => handleSideBar("home")}
              >
                Home
              </button>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem>
              <button
                className="btn-link-style"
                onClick={() => handleSideBar("all")}
              >
                All products
              </button>
            </MDBBreadcrumbItem>
            {activeCategory && (
              <MDBBreadcrumbItem>
                <button
                  className="btn-link-style"
                  onClick={() => handleSideBar("category")}
                >
                  {capitalize.firstLetter(activeCategory?.name)}
                </button>
              </MDBBreadcrumbItem>
            )}

            {!sideBarActive && (
              <MDBBreadcrumbItem
                active
                style={{
                  whiteSpace: "nowrap",
                  maxWidth: "500px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {capitalize.firstLetter(selected.name)}
              </MDBBreadcrumbItem>
            )}
          </MDBBreadcrumb>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
