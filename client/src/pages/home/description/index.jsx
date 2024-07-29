import React from "react";
import { MDBRow, MDBCol, MDBIcon, MDBAnimation } from "mdbreact";
import Phone from "../../../assets/landing/phone.jpg";

export default function Description() {
  return (
    <section className="section my-5" data-wow-delay="0.3s">
      <MDBAnimation type="fadeInUp" reveal>
        <h1 className="text-center my-5 h1">Why Choose Liberty?</h1>
      </MDBAnimation>
      <MDBAnimation type="fadeInUp" reveal>
        <p className="text-center mb-5 w-responsive mx-auto">
          At Liberty, we are dedicated to providing the highest quality hardware
          solutions to meet your needs. Our experienced team is committed to
          delivering reliable and efficient products that help you succeed in
          all your projects.
        </p>
      </MDBAnimation>
      <MDBRow>
        <MDBCol md="4">
          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon size="2x" className="indigo-text" icon="tools" />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Durable</h5>
                <p className="grey-text">
                  Our products are built to last, ensuring you get the most out
                  of your investment with long-lasting and reliable hardware.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon size="2x" className="blue-text" icon="lightbulb" />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Innovative</h5>
                <p className="grey-text">
                  We embrace innovation to bring you the latest and most
                  effective hardware solutions for your projects.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon size="2x" className="cyan-text" icon="hands-helping" />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Supportive</h5>
                <p className="grey-text">
                  We provide excellent customer support, ensuring you have the
                  assistance you need to complete your projects successfully.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol md="4 mb-2 text-center text-md-left flex-center ">
          <MDBAnimation reveal type="fadeInUp">
            <img
              src={Phone}
              alt="Hardware"
              className="z-depth-0"
              height={300}
            />
          </MDBAnimation>
        </MDBCol>

        <MDBCol md="4">
          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Trusted</h5>
                <p className="grey-text">
                  Our clients trust us to provide reliable hardware solutions
                  that meet their needs and exceed their expectations.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon
                  size="2x"
                  icon="thumbs-up"
                  className="deep-purple-text"
                />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Efficient</h5>
                <p className="grey-text">
                  Our streamlined processes ensure you get the hardware you need
                  quickly and efficiently, keeping your projects on track.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon size="2x" icon="rocket" className="text-warning" />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Exceptional</h5>
                <p className="grey-text">
                  Combining creativity and technical expertise, we deliver
                  exceptional hardware solutions that elevate your projects.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon size="2x" icon="star" className="pink-text" />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </section>
  );
}
