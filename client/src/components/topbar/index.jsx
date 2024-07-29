import React, { Component } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { connect } from "react-redux";

class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleToggleClickA = this.handleToggleClickA.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  handleToggleClickA() {
    this.props.onSideNavToggleClick();
  }

  render() {
    const navStyle = {
      paddingLeft: this.props.toggle ? "16px" : "240px",
      transition: "padding-left .3s",
    };

    const { auth } = this.props;
    return (
      <MDBNavbar
        // className="flexible-MDBNavbar"
        light
        expand="md"
        // scrolling
        fixed="top"
        style={{ zIndex: 3 }}
      >
        <div
          onClick={this.handleToggleClickA}
          key="sideNavToggleA"
          style={{
            lineHeight: "32px",
            marginleft: "1em",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        >
          <MDBIcon icon="bars" color="white" size="lg" />
        </div>

        <MDBNavbarBrand href="#" style={navStyle}>
          {/* <strong>{route}</strong> */}
        </MDBNavbarBrand>
        <MDBNavbarNav expand="sm" right style={{ flexDirection: "row" }}>
          <MDBDropdown>
            <MDBDropdownToggle nav>
              <MDBIcon icon="user" />
              &nbsp;
              <span className="d-none d-md-inline">Profile</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu right style={{ minWidth: "200px" }}>
              <MDBDropdownItem disabled={!auth._id} href="/profile">
                My Account
              </MDBDropdownItem>
              <MDBDropdownItem
                onClick={() => {
                  if (auth._id) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                  }
                  window.location.href = "/";
                }}
              >
                Log Out
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavbarNav>
      </MDBNavbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.auth, // Replace with your actual state property
    route: state.auth.route,
  };
};

export default connect(mapStateToProps)(TopNavigation);
