import React from "react";
import { MDBCol, MDBAvatar, MDBRow, MDBIcon } from "mdbreact";

export default function Pioneers() {
  return (
    <section className="team-section text-center my-5">
      <h1 className="text-center my-5 h1">Pioneers</h1>
      <p className="text-center mb-5 w-responsive mx-auto">
        Our team is composed of talented professionals with diverse expertise,
        working collaboratively to deliver exceptional results for our clients.
      </p>

      <MDBRow className="text-center">
        <MDBCol md="4" className="mb-4">
          <div className="testimonial">
            <MDBAvatar
              tag="img"
              src="https://mdbootstrap.com/img/Photos/Avatars/img%20(1).jpg"
              circle
              className="z-depth-1"
            />

            <h4 className="font-weight-bold mt-4 mb-3">Thomas Pajarillaga</h4>
            <h6 className="mb-3 font-weight-bold grey-text">CTO</h6>
            <p>
              <MDBIcon icon="quote-left" /> Transforming ideas into seamless and
              intuitive web experiences.
            </p>
          </div>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <div className="testimonial">
            <MDBAvatar
              tag="img"
              src="https://mdbootstrap.com/img/Photos/Avatars/img%20(32).jpg"
              circle
              className="z-depth-1"
            />
            <h4 className="font-weight-bold mt-4 mb-3">
              Tomas Pajarillaga Jr.
            </h4>
            <h6 className="mb-3 font-weight-bold grey-text">CEO</h6>
            <p>
              <MDBIcon icon="quote-left" /> Powering applications with robust
              and efficient server-side functionality.
            </p>
          </div>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <div className="testimonial">
            <MDBAvatar
              tag="img"
              src="https://mdbootstrap.com/img/Photos/Avatars/img%20(10).jpg"
              circle
              className="z-depth-1"
            />
            <h4 className="font-weight-bold mt-4 mb-3">Benedict Pajarillaga</h4>
            <h6 className="mb-3 font-weight-bold grey-text">COO</h6>
            <p>
              <MDBIcon icon="quote-left" /> Transforming visions into
              pixel-perfect designs that leave a lasting impression.
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </section>
  );
}
