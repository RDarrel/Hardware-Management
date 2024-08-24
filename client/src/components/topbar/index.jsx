import React, { useEffect, useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { BROWSE, DESTROY } from "../../services/redux/slices/notifications";
import { fullName } from "../../services/utilities";
import TimeSince from "./timeSince";

const message = {
  REQUEST: "sent a purchase request.",
  DEFECTIVE: "has received defective products.",
  DISCREPANCY: "has received products with discrepancies.",
};
const TopNavigation = ({ onSideNavToggleClick }) => {
  const { auth, token, role } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ notifications }) => notifications),
    [notifications, setNotifications] = useState([]),
    history = useHistory(),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    setNotifications(collections);
  }, [collections]);

  const handleToggleClickA = () => {
    onSideNavToggleClick();
  };

  const navStyle = {
    paddingLeft: onSideNavToggleClick ? "16px" : "240px",
    transition: "padding-left .3s",
  };

  const handleNotification = (_id, type) => {
    dispatch(DESTROY({ token, data: { _id } }));
    const url = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    history.push(`/purchases${url}`);
  };

  return (
    <MDBNavbar light expand="md" fixed="top" style={{ zIndex: 3 }}>
      <div
        onClick={handleToggleClickA}
        key="sideNavToggleA"
        style={{
          lineHeight: "32px",
          marginLeft: "1em",
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
        {role === "ADMINISTRATOR" && (
          <MDBDropdown>
            <MDBDropdownToggle nav caret>
              <MDBBadge color="red" className="mr-2">
                {notifications.length}
              </MDBBadge>
              <MDBIcon icon="bell" />
              <span className="d-none d-md-inline">Notifications</span>
            </MDBDropdownToggle>
            <MDBDropdownMenu right style={{ minWidth: "515px" }}>
              {!!notifications &&
                notifications.map(({ user, type, createdAt, _id }, index) => (
                  <MDBDropdownItem
                    onClick={() => handleNotification(_id, type)}
                    key={index}
                  >
                    <MDBIcon icon="user" className="mr-2" />
                    {fullName(user.fullName)} {message[type]}
                    <span className="float-right">
                      <MDBIcon icon="clock" />{" "}
                      {<TimeSince createdAt={createdAt} />}
                    </span>
                  </MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        )}
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
};

export default TopNavigation;
