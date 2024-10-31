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
import {
  BROWSE,
  DESTROY,
  UPDATE,
  UPDATE_COLLECTIONS,
} from "../../services/redux/slices/notifications";
import { fullName, socket } from "../../services/utilities";
import TimeSince from "./timeSince";

const notificationRoles = {
  STOCKMAN: {
    REQUEST: {
      APPROVED: "request has been approved.",
      REJECT: "request has been rejected.",
      OUTOFSTOCK: "We have products that are out of stock.",
      NEARLY_OUTOFSTOCK: "We have products that are nearly out of stock.",
      NEARLY_EXPIRED_PRODUCT: "We have products that are nearly expired.",
      EXPIRED: "We have expired products.",
      ORDERBY_ADMIN:
        "Admin ordered from the supplier. Get ready to receive the items.",
    },

    DEFECTIVE: {
      APPROVED: "A replacement product from the supplier is on the way.",
    },
    DISCREPANCY: {
      APPROVED: "A discrepancy product from the supplier is on the way.",
    },
  },

  ADMINISTRATOR: {
    REQUEST: "sent a purchase request.",
    DEFECTIVE: "has received defective products.",
    DISCREPANCY: "has received products with discrepancies.",
  },
};

const TopNavigation = ({ onSideNavToggleClick }) => {
  const { auth, token, role } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ notifications }) => notifications),
    [notifications, setNotifications] = useState([]),
    [notificationCount, setNotificationCount] = useState(0),
    history = useHistory(),
    dispatch = useDispatch();

  const isStockman = role === "STOCKMAN";

  useEffect(() => {
    if (role && auth._id) {
      dispatch(BROWSE({ token, key: { role, user: auth._id } }));
    }
  }, [token, dispatch, role, auth]);

  useEffect(() => {
    const myMessages = collections.filter(
      ({ forStockman = true }) => forStockman === isStockman
    );

    const notSeenMessages = myMessages.filter(
      ({ isSeen = true, additional = false }) => !isSeen || additional
    );
    setNotificationCount(notSeenMessages.length);
    setNotifications(myMessages);
  }, [collections, isStockman]);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      dispatch(UPDATE_COLLECTIONS(data));
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [dispatch]);

  const handleToggleClickA = () => {
    onSideNavToggleClick();
  };

  const navStyle = {
    paddingLeft: onSideNavToggleClick ? "240px" : "16px",
    transition: "padding-left .3s",
  };

  const handleLink = (status, type = "", additional) => {
    var baseUrl = "";
    if (additional) {
      if (status === "EXPIRED") {
        baseUrl = "stocks";
      } else {
        baseUrl = "dashboard";
      }
    } else {
      switch (type) {
        case "REQUEST":
          baseUrl = "/purchasesRequest";
          break;
        case "DEFECTIVE":
          baseUrl = "/purchasesDefective";
          break;

        case "DISCREPANCY":
          baseUrl = "/purchasesDiscrepancy";
          break;
        default:
          baseUrl = "/purchasesRequest";
          break;
      }
    }

    history.push(baseUrl);
  };

  const handleNotification = (_id, status, type, additional) => {
    handleLink(status, type, additional);

    if (!additional) {
      dispatch(DESTROY({ token, data: { _id } }));
    } else {
      const _notifications = [...notifications];
      const index = _notifications.findIndex(({ _id: id }) => _id === id);

      _notifications.splice(index, 1);
      setNotifications(_notifications);
    }
  };

  const handleMessage = (user, type, status) => {
    const baseNotif = notificationRoles[role][type.toUpperCase()] || "";

    if (isStockman) {
      if (
        (status === "REJECT" || status === "APPROVED") &&
        type === "REQUEST"
      ) {
        return `${user._id === auth._id ? `Your` : fullName(user.fullName)} ${
          baseNotif[status]
        }`;
      } else {
        return baseNotif[status];
      }
    } else {
      return `${fullName(user.fullName)} ${baseNotif}`;
    }
  };

  const handleSeen = () => {
    const _notifications = notifications.filter(
      ({ additional = false, isSeen = false }) => !isSeen && !additional
    );
    if (_notifications.length > 0) {
      dispatch(UPDATE({ token, data: { notifications: _notifications } }));
    }
    setNotificationCount(0);
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
        <span className="font-weight-bold">{role}</span>
      </MDBNavbarBrand>
      <MDBNavbarNav expand="sm" right style={{ flexDirection: "row" }}>
        <MDBDropdown>
          <MDBDropdownToggle nav caret onClick={() => handleSeen()}>
            {notificationCount > 0 && (
              <MDBBadge color="red" className="mr-2">
                {notificationCount}
              </MDBBadge>
            )}
            <MDBIcon icon="bell" />
            <span className="d-none d-md-inline">Notifications</span>
          </MDBDropdownToggle>
          <MDBDropdownMenu right style={{ minWidth: "515px" }}>
            {notifications.length > 0 ? (
              notifications.map(
                (
                  { user, type, status, createdAt, _id, additional = false },
                  index
                ) => (
                  <MDBDropdownItem
                    onClick={() =>
                      handleNotification(_id, status, type, additional)
                    }
                    key={index}
                  >
                    <MDBIcon
                      icon={additional ? "newspaper" : "user"}
                      className="mr-2"
                    />
                    {handleMessage(user, type, status) || ""}
                    {!additional && (
                      <span className="float-right">
                        <MDBIcon icon="clock" />{" "}
                        {<TimeSince createdAt={createdAt} />}
                      </span>
                    )}
                  </MDBDropdownItem>
                )
              )
            ) : (
              <span className="text-center">No notifications.</span>
            )}
          </MDBDropdownMenu>
        </MDBDropdown>
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
