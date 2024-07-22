import React from "react";
import { MDBBreadcrumb, MDBBreadcrumbItem } from "mdbreact";
const BreadCrumb = ({ selected }) => {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center">
        <div className="w-75">
          <MDBBreadcrumb>
            <MDBBreadcrumbItem>
              <a href="#">Home</a>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem>
              <a href="#">All products</a>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem>
              <a href="#">{selected.category?.name}</a>
            </MDBBreadcrumbItem>

            <MDBBreadcrumbItem
              active
              style={{
                whiteSpace: "nowrap",
                maxWidth: "500px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selected.name}
            </MDBBreadcrumbItem>
          </MDBBreadcrumb>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
