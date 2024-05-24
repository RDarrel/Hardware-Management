import React from "react";
import { MDBBadge } from "mdbreact";

const taskBadge = importance => {
  if (!importance) return <MDBBadge>Invalid Text</MDBBadge>;

  let color = "primary";

  switch (importance) {
    case "Low":
      color = "warning";
      break;

    case "High":
      color = "danger";
      break;

    default:
      color = "primary";
      break;
  }

  return <MDBBadge color={color}>{importance}</MDBBadge>;
};

export default taskBadge;
