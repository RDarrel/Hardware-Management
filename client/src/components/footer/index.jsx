import React from "react";
import { MDBFooter } from "mdbreact";

export default function Copyrights() {
  return (
    <MDBFooter style={{ zIndex: 2 }}>
      <p className="footer-copyright mb-0 py-3 text-center">
        &copy; 2024 Copyright:&nbsp;
        <a href="https://www.technowiz.com"> Liberty Hardware.com </a>
      </p>
    </MDBFooter>
  );
}
