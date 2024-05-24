import React from "react";
import { MDBFooter } from "mdbreact";

export default function Copyrights() {
  return (
    <MDBFooter style={{ zIndex: 2 }}>
      <p className="footer-copyright mb-0 py-3 text-center">
        &copy; 2023 Copyright:&nbsp;
        <a href="https://www.technowiz.com"> TechnoWiz.com </a>
      </p>
    </MDBFooter>
  );
}
