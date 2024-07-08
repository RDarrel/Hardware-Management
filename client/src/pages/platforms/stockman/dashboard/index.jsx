import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBIcon,
  MDBProgress,
  MDBTable,
} from "mdbreact";

export default function Dashboard() {
  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <section className="mt-2">
        <MDBRow>
          <MDBCol xl="6" md="6" className="mb-2">
            <MDBCard>
              <MDBCardHeader color="primary-color">
                Nearly Products Expired
              </MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-up" className="blue-text mr-3" />{" "}
                2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol xl="6" md="6" className="mb-2">
            <MDBCard>
              <MDBCardHeader color="danger-color">
                Product Out of Stocks
              </MDBCardHeader>
              <h6 className="ml-4 mt-5 dark-grey-text font-weight-bold">
                <MDBIcon icon="long-arrow-alt-down" className="red-text mr-3" />
                $ 2000
              </h6>
              <MDBCardBody>
                <MDBProgress value={45} barClassName="grey darken-2" />
                <p className="font-small grey-text">
                  Better than last week (25%)
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
      <section>
        <MDBRow>
          <MDBCol lg="6" md="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable responsive>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Keywords</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Visits</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Pages</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Design</td>
                      <td>15</td>
                      <td>307</td>
                    </tr>
                    <tr>
                      <td>Bootstrap</td>
                      <td>32</td>
                      <td>504</td>
                    </tr>
                    <tr>
                      <td>MDBootstrap</td>
                      <td>41</td>
                      <td>613</td>
                    </tr>
                    <tr>
                      <td>Frontend</td>
                      <td>14</td>
                      <td>208</td>
                    </tr>
                  </tbody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="6" md="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Browser</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Visits</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Pages</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Google Chrome</td>
                      <td>15</td>
                      <td>307</td>
                    </tr>
                    <tr>
                      <td>Mozilla Firefox</td>
                      <td>32</td>
                      <td>504</td>
                    </tr>
                    <tr>
                      <td>Safari</td>
                      <td>41</td>
                      <td>613</td>
                    </tr>
                    <tr>
                      <td>Opera</td>
                      <td>14</td>
                      <td>208</td>
                    </tr>
                  </tbody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
}
