import React from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavItem,
  MDBRow,
  MDBCol,
  MDBMask,
  MDBIcon,
  MDBView,
  MDBFooter,
  MDBNavLink,
} from "mdbreact";
import "./index.css";
import Copyrights from "../../components/footer";
import Register from "./register";
import ContactUs from "./contact";
import Login from "./login";
import Description from "./description";
// import Pioneers from "./pioneers";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      show: false,
    };
  }

  toggle = () => this.setState({ show: !this.state.show });

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));

  render() {
    return (
      <div id="landing">
        <MDBNavbar dark expand="md" fixed="top" scrolling transparent>
          <MDBContainer>
            <MDBNavbarBrand>
              <strong className="white-text">Liberty Hardware</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse("navbarCollapse")} />
            <MDBCollapse
              id="navbarCollapse"
              isOpen={this.state.collapseID}
              navbar
            >
              <MDBNavbarNav right>
                <MDBNavItem>
                  <MDBNavLink to="/login">
                    <h5 className="login-txt">Login</h5>
                  </MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>

        <section id="home">
          <Login show={this.state.show} toggle={this.toggle} />
          <MDBView>
            <MDBMask
              className="d-flex justify-content-center align-items-center"
              overlay="gradient"
            >
              <MDBContainer className="h-100 d-flex justify-content-center align-items-center">
                <Register />
              </MDBContainer>
            </MDBMask>
          </MDBView>
        </section>
        <MDBContainer>
          <Description />

          <hr className="mb-4" />

          <section id="contact">
            <h2 className="text-center my-5 h1">Contact us</h2>
            <p className="text-center mb-5 w-responsive mx-auto">
              We look forward to hearing from you and discussing how we can
              assist you with your needs.
            </p>
            <ContactUs />
          </section>
        </MDBContainer>
        <MDBFooter className="mt-5 text-center text-md-left">
          <MDBContainer>
            <MDBRow>
              <MDBCol md="12">
                <ul className="list-unstyled d-flex justify-content-center mb-0 pb-0 pt-2 list-inline">
                  <li
                    className="list-inline-item cursor-pointer"
                    onClick={() =>
                      window.open("https://www.facebook.com/z3.star/", "_blank")
                    }
                  >
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="2x"
                      className="white-text p-2 m-2"
                    />
                  </li>
                  <li
                    className="list-inline-item cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/benedict-pajarillaga-98b864222/",
                        "_blank"
                      )
                    }
                  >
                    <MDBIcon
                      fab
                      icon="linkedin"
                      size="2x"
                      className="white-text p-2 m-2"
                    />
                  </li>
                </ul>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <Copyrights />
        </MDBFooter>
      </div>
    );
  }
}
