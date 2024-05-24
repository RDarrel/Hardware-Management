import React from "react";

const fullName = fullname => {
  if (typeof fullname !== "object") return <i>Datatype mismatch</i>;

  if (fullname.fname) {
    const { fname, mname, lname, suffix } = fullname;
    let middleName = "";

    if (mname) {
      middleName = `${mname
        .split(" ")
        .map(middle => middle.charAt(0).toUpperCase())
        .join("")}.`;
    }

    return `${lname}, ${fname} ${middleName} ${
      suffix ? `(${suffix})` : ""
    }`.replace(/^\s+|\s+$/gm, "");
  }

  return <i>Incomplete</i>;
};

export default fullName;
