import React, { useState, useEffect } from "react";
import {
  MDBSideNavLink,
  MDBSideNavCat,
  MDBSideNavNav,
  MDBSideNav,
  MDBIcon,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import ACCESS from "../../pages/platforms/access";
import { SETROUTE } from "../../services/redux/slices/auth";

export default function SideNavigation({
  triggerOpening,
  breakWidth,
  onLinkClick,
}) {
  const [links, setLinks] = useState([]),
    { role } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (role) {
      setLinks(ACCESS[role] || []);
    }
  }, [role]);

  const handleLinks = () => {
    if (links.length === 0)
      return (
        <MDBSideNavLink to="/" topLevel onClick={onLinkClick}>
          <MDBIcon icon="home mr-2" />
          Home
        </MDBSideNavLink>
      );

    return links.map(({ path, name, icon, children }, index) => {
      if (children)
        return (
          <MDBSideNavCat
            id={`${name}-cat`}
            name={name}
            key={`sidebar-${index}`}
            icon={icon}
          >
            {children.map((child, cIndex) => (
              <MDBSideNavLink
                key={`sidebar-${index}-${cIndex}`}
                to={`${path}${child.path}`}
                onClick={() => {
                  onLinkClick();
                  dispatch(SETROUTE(child.name));
                }}
              >
                {child.name}
              </MDBSideNavLink>
            ))}
          </MDBSideNavCat>
        );

      return (
        <MDBSideNavLink
          key={`sidebar-${index}`}
          to={path}
          topLevel
          onClick={() => {
            onLinkClick();
            dispatch(SETROUTE(name));
          }}
        >
          <MDBIcon icon={`${icon} mr-2`} />
          {name}
        </MDBSideNavLink>
      );
    });
  };

  return (
    <div className="white-skin">
      <MDBSideNav
        logo="https://mdbootstrap.com/img/Marketing/general/logo/medium/mdb-react.png"
        bg="https://mdbootstrap.com/img/Photos/Others/sidenav2.jpg"
        mask="strong"
        href="/dashboard"
        fixed
        breakWidth={breakWidth}
        triggerOpening={triggerOpening}
        style={{ transition: "padding-left .3s" }}
      >
        <MDBSideNavNav>{handleLinks()}</MDBSideNavNav>
      </MDBSideNav>
    </div>
  );
}
