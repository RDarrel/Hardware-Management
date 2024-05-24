import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBView,
  MDBCardTitle,
  MDBCardBody,
  MDBCardGroup,
  MDBCardFooter,
  MDBIcon,
  MDBMask,
  MDBPagination,
  MDBPageItem,
  MDBPageNav,
  MDBAvatar,
  MDBBtn,
} from "mdbreact";
import { useSelector } from "react-redux";
import {
  PresetImage,
  fullAddress,
  fullName,
} from "../../../services/utilities";
import { useHistory } from "react-router";

export default function ViewProfile({ user }) {
  const { image, auth } = useSelector(({ auth }) => auth),
    [account, setAccount] = useState({}),
    history = useHistory();

  useEffect(() => {
    setAccount(user && user._id ? user : auth);
  }, [auth, user]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol lg="4" md="12">
          <MDBCard testimonial className="profile-card text-center mb-4 mt-5">
            <MDBAvatar
              tag="img"
              alt={`view-profile-${account._id}`}
              src={image}
              onError={e => (e.target.src = PresetImage(account.isMale))}
              className="z-depth-1-half mx-auto"
            />
            <MDBCardBody>
              <MDBCardTitle>
                <strong>{fullName(account.fullName)}</strong>
              </MDBCardTitle>
              <h5>{account.role?.name}</h5>
              {auth.address && (
                <p className="dark-grey-text">
                  {fullAddress(auth.address, false)}
                </p>
              )}

              <MDBBtn floating tag="a" color="">
                <MDBIcon fab icon="facebook" className="dark-grey-text" />
              </MDBBtn>
              <MDBBtn floating tag="a" color="">
                <MDBIcon fab icon="twitter" className="dark-grey-text" />
              </MDBBtn>
              <MDBBtn floating tag="a" color="">
                <MDBIcon fab icon="linkedin" className="dark-grey-text" />
              </MDBBtn>
              <p className="card-text mt-3">{auth.bio}</p>
            </MDBCardBody>
          </MDBCard>
          {/* <MDBCard className="mb-4">
            <MDBCardBody className="text-center">
              <h5>
                <strong>John's Achievements</strong>
              </h5>

              <hr className="my-3" />

              <MDBBtn
                color="light-blue"
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("bootstrap")}
              >
                Bootstrap Master
              </MDBBtn>
              <MDBBtn
                color="blue-grey"
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("wordpress")}
              >
                WordPress Master
              </MDBBtn>
              <MDBBtn
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("angular")}
              >
                Angular Master
              </MDBBtn>
              <MDBBtn
                color="secondary"
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("mdb")}
              >
                MDB Master
              </MDBBtn>
              <MDBBtn
                color="deep-purple"
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("community")}
              >
                Community contributor
              </MDBBtn>
              <MDBBtn
                color="indigo"
                size="sm"
                rounded
                className="px-3"
                onClick={() => this.toggle("pro")}
              >
                MDB Pro User
              </MDBBtn>
            </MDBCardBody>
          </MDBCard> */}
        </MDBCol>
        <MDBCol lg="8" md="12" className="text-center">
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
            <h4>
              <strong>{auth.fullName?.fname}'s projects</strong>
            </h4>
            <MDBBtn
              color="info"
              rounded
              size="sm"
              onClick={() => history.push("/profile/update")}
            >
              Update profile
            </MDBBtn>
          </div>
          <MDBCardGroup deck>
            <MDBCard className="mb-5" narrow>
              <MDBView cascade hover>
                <img
                  src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-profile-page.jpg"
                  className="img-fluid"
                  alt="project one"
                />
                <a href="#!">
                  <MDBMask overlay="white-slight" />
                </a>
              </MDBView>
              <MDBCardBody>
                <h4 className="card-title">Project name</h4>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </MDBCardBody>
              <MDBCardFooter className="links-light">
                <span className="pull-left pt-2">
                  <a href="#!">
                    <MDBIcon icon="share-alt" className="mr-2" />
                  </a>
                  <a href="#!">
                    <MDBIcon icon="heart" className="mr-2" />
                    10
                  </a>
                </span>
                <span className="float-right">
                  <a href="#!" className="waves-effect p-2">
                    Live Preview <MDBIcon icon="image" className="ml-1" />
                  </a>
                </span>
              </MDBCardFooter>
            </MDBCard>

            <MDBCard className="mb-5" narrow>
              <MDBView cascade hover>
                <img
                  src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-signup.jpg"
                  className="img-fluid"
                  alt="project one"
                />
                <a href="#!">
                  <MDBMask overlay="white-slight" />
                </a>
              </MDBView>
              <MDBCardBody>
                <h4 className="card-title">Project name</h4>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </MDBCardBody>
              <MDBCardFooter className="links-light">
                <span className="pull-left pt-2">
                  <a href="#!">
                    <MDBIcon icon="share-alt" className="mr-2" />
                  </a>
                  <a href="#!">
                    <MDBIcon icon="heart" className="mr-2" />
                    15
                  </a>
                </span>
                <span className="float-right">
                  <a href="#!" className="waves-effect p-2">
                    Live Preview <MDBIcon icon="image" className="ml-1" />
                  </a>
                </span>
              </MDBCardFooter>
            </MDBCard>
          </MDBCardGroup>

          <MDBCardGroup deck>
            <MDBCard className="mb-5" narrow>
              <MDBView cascade hover>
                <img
                  src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-pricing.jpg"
                  className="img-fluid"
                  alt="project one"
                />
                <a href="#!">
                  <MDBMask overlay="white-slight" />
                </a>
              </MDBView>
              <MDBCardBody>
                <h4 className="card-title">Project name</h4>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </MDBCardBody>
              <MDBCardFooter className="links-light">
                <span className="pull-left pt-2">
                  <a href="#!">
                    <MDBIcon icon="share-alt" className="mr-2" />
                  </a>
                  <a href="#!">
                    <MDBIcon icon="heart" className="mr-2" />
                    21
                  </a>
                </span>
                <span className="float-right">
                  <a href="#!" className="waves-effect p-2">
                    Live Preview <MDBIcon icon="image" className="ml-1" />
                  </a>
                </span>
              </MDBCardFooter>
            </MDBCard>

            <MDBCard className="mb-5" narrow>
              <MDBView cascade hover>
                <img
                  src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-landing.jpg"
                  className="img-fluid"
                  alt="project one"
                />
                <a href="#!">
                  <MDBMask overlay="white-slight" />
                </a>
              </MDBView>
              <MDBCardBody>
                <h4 className="card-title">Project name</h4>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </MDBCardBody>
              <MDBCardFooter className="links-light">
                <span className="pull-left pt-2">
                  <a href="#!">
                    <MDBIcon icon="share-alt" className="mr-2" />
                  </a>
                  <a href="#!">
                    <MDBIcon icon="heart" className="mr-2" />
                    36
                  </a>
                </span>
                <span className="float-right">
                  <a href="#!" className="waves-effect p-2">
                    Live Preview <MDBIcon icon="image" className="ml-1" />
                  </a>
                </span>
              </MDBCardFooter>
            </MDBCard>
          </MDBCardGroup>

          <MDBPagination circle className="my-4 float-right">
            <li className="page-item disabled clearfix d-none d-md-block">
              <a className="page-link" href="#!">
                First
              </a>
            </li>
            <MDBPageItem disabled>
              <MDBPageNav className="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </MDBPageNav>
            </MDBPageItem>
            <MDBPageItem active>
              <MDBPageNav className="page-link">
                1 <span className="sr-only">(current)</span>
              </MDBPageNav>
            </MDBPageItem>
            <MDBPageItem>
              <MDBPageNav className="page-link">2</MDBPageNav>
            </MDBPageItem>
            <MDBPageItem>
              <MDBPageNav className="page-link">3</MDBPageNav>
            </MDBPageItem>
            <MDBPageItem>
              <MDBPageNav className="page-link">4</MDBPageNav>
            </MDBPageItem>
            <MDBPageItem>
              <MDBPageNav className="page-link">5</MDBPageNav>
            </MDBPageItem>
            <MDBPageItem>
              <MDBPageNav className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </MDBPageNav>
            </MDBPageItem>
          </MDBPagination>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
