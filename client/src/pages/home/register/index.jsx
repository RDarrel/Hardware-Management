import React, { useEffect } from "react";
import { MDBAnimation, MDBCol, MDBRow } from "mdbreact";
import { useSelector } from "react-redux";

export default function Register() {
  const { isSuccess } = useSelector(({ users }) => users);

  useEffect(() => {
    if (isSuccess) {
      // let task = "register reset not working";
      document.getElementById("registration-form").reset();
    }
  }, [isSuccess]);

  return (
    <MDBRow className=" pt-5 mt-3">
      <MDBCol md="6" className="text-center text-md-left mb-5">
        <MDBAnimation type="fadeInLeft">
          <div className="white-text">
            <h1 className="font-weight-bold display-4">
              WHAT <br /> ARE YOU <br /> WAITING FOR?
            </h1>
            <h6>
              Give your future a boost at Liberty! We're committed to providing
              top-notch service and products to help you succeed in all your
              projects. Let's build something great together!
            </h6>
          </div>
        </MDBAnimation>
      </MDBCol>
      {/* <MDBCol md="6" className="col-xl-5 offset-xl-1">
        <MDBAnimation type="fadeInRight">
          <form
            onSubmit={handleSubmit}
            id="registration-form"
            autoComplete="off"
          >
            <MDBCard>
              <MDBCardBody>
                <div className="text-center">
                  <h3 className="white-text">
                    <MDBIcon icon="user" className="white-text" /> Register
                  </h3>
                  <hr className="hr-light" />
                </div>

                <MDBInput
                  label="E-mail Address"
                  icon="envelope"
                  type="email"
                  labelClass="white-text"
                  iconClass="white-text"
                  name="email"
                  required
                />
                <MDBInput
                  label="Password"
                  minLength={8}
                  icon={isLocked.password ? "lock" : "unlock"}
                  onIconMouseEnter={() =>
                    setIsLocked({ ...isLocked, password: false })
                  }
                  onIconMouseLeave={() =>
                    setIsLocked({ ...isLocked, password: true })
                  }
                  type={isLocked.password ? "password" : "text"}
                  labelClass="white-text"
                  iconClass="white-text"
                  name="password"
                  required
                />
                <MDBInput
                  label="Confirm your password"
                  minLength={8}
                  icon={isLocked.confirmPassword ? "lock" : "unlock"}
                  onIconMouseEnter={() =>
                    setIsLocked({ ...isLocked, confirmPassword: false })
                  }
                  onIconMouseLeave={() =>
                    setIsLocked({ ...isLocked, confirmPassword: true })
                  }
                  type={isLocked.confirmPassword ? "password" : "text"}
                  labelClass="white-text"
                  iconClass="white-text"
                  name="confirmPassword"
                  required
                />

                <MDBInput
                  label="I read and agree with the Terms and Conditions"
                  labelClass="white-text"
                  type="checkbox"
                  id="agreement"
                  required
                />

                {message && (
                  <div
                    className={`alert alert-${
                      isSuccess ? "success" : "warning"
                    } text-center mt-3`}
                  >
                    {message}
                  </div>
                )}

                <div className="text-center mt-4">
                  <MDBBtn
                    disabled={isLoading}
                    type="submit"
                    color="light-blue"
                    rounded
                  >
                    {isLoading ? <MDBIcon icon="spinner" spin /> : "Sign up"}
                  </MDBBtn>
                  <hr className="hr-light mb-3 mt-4" />

                  <div className="inline-ul text-center d-flex justify-content-center">
                    <MDBIcon
                      fab
                      icon="google"
                      size="lg"
                      className="white-text p-2 m-2 cursor-pointer"
                    />
                    <MDBIcon
                      fab
                      icon="facebook"
                      size="lg"
                      className="white-text p-2 m-2 cursor-pointer"
                    />
                    <MDBIcon
                      fab
                      icon="yahoo"
                      size="lg"
                      className="white-text p-2 m-2 cursor-pointer"
                    />
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </form>
        </MDBAnimation>
      </MDBCol> */}
    </MDBRow>
  );
}
