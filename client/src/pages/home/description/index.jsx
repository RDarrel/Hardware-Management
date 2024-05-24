import React from "react";
import Phone from "../../../assets/landing/phone.jpg";
import { MDBRow, MDBCol, MDBIcon, MDBAnimation } from "mdbreact";

export default function Description() {
  return (
    <section className="section my-5" data-wow-delay="0.3s">
      <MDBAnimation type="fadeInUp" reveal>
        <h1 className="text-center my-5 h1">Why is it so great?</h1>
      </MDBAnimation>
      <MDBAnimation type="fadeInUp" reveal>
        <p className="text-center mb-5 w-responsive mx-auto">
          Our solution provider company is highly esteemed for its exceptional
          ability to understand client needs and deliver tailored solutions that
          drive efficiency and success. With a team of skilled professionals and
          a deep understanding of industry trends and technologies, we
          consistently provide high-quality solutions that meet specific
          requirements and enhance business processes.
        </p>
      </MDBAnimation>
      <MDBRow>
        <MDBCol md="4">
          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon size="2x" className="indigo-text" icon="shield-alt" />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Secure</h5>
                <p className="grey-text">
                  We prioritize data and system security, implementing robust
                  measures to ensure confidentiality, integrity, and
                  availability.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon size="2x" className="blue-text" icon="flask" />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Experimental</h5>
                <p className="grey-text">
                  We embrace experimentation and innovation to push boundaries
                  and discover cutting-edge solutions for our clients' unique
                  challenges.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInLeftBig" duration="1.25s">
                <MDBIcon
                  size="2x"
                  className="cyan-text"
                  icon="glass-martini-alt"
                />
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="10">
              <MDBAnimation reveal type="fadeInLeftBig">
                <h5 className="font-weight-bold my-4">Relaxing</h5>
                <p className="grey-text">
                  We aim to provide a stress-free experience for our clients by
                  handling their challenges and providing effective solutions,
                  allowing them to relax and focus on their core business.
                </p>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol md="4 mb-2 text-center text-md-left flex-center">
          <MDBAnimation reveal type="fadeInUp">
            <img src={Phone} alt="" className="z-depth-0" />
          </MDBAnimation>
        </MDBCol>

        <MDBCol md="4">
          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Beloved</h5>
                <p className="grey-text">
                  We strive to earn the trust and loyalty of our clients by
                  delivering exceptional solutions and personalized service.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon size="2x" icon="heart" className="deep-purple-text" />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Rapid</h5>
                <p className="grey-text">
                  Our agile approach and streamlined processes enable us to
                  deliver solutions quickly, ensuring timely results for our
                  clients.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon size="2x" icon="bolt" className="text-warning" />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-2">
            <MDBCol size="10" className="text-right">
              <MDBAnimation reveal type="fadeInRightBig">
                <h5 className="font-weight-bold my-4">Magical</h5>
                <p className="grey-text">
                  Through a combination of creativity and technical expertise,
                  we create transformative solutions that seem like magic,
                  bringing joy and excitement to our clients' operations.
                </p>
              </MDBAnimation>
            </MDBCol>
            <MDBCol size="2">
              <MDBAnimation reveal type="fadeInRightBig" duration="1.25s">
                <MDBIcon size="2x" icon="magic" className="pink-text" />
              </MDBAnimation>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </section>
  );
}
