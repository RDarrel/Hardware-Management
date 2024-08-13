import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol, MDBCard, MDBBtn, MDBIcon } from "mdbreact";
import GET from "../report/header/GET";
import arrangeBy from "../report/header/arrangeBy";
import formattedTotal from "../../../../services/utilities/forattedTotal";
const Total = ({ sales: collections }) => {
  const [total, setTotal] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const filteredSales = collections.filter(({ createdAt }) => {
      const saleDate = new Date(createdAt);
      const isSameYear = saleDate.getFullYear() === currentYear;

      return isSameYear;
    });
    const salesWithIncome = filteredSales.map((sale) => {
      return { ...sale, income: handleIncome(sale, sale.product?.isPerKilo) };
    });
    const arrangeSales = arrangeBy.sales(salesWithIncome);

    const totalSalesAndIncome = GET.salesAndIncome(arrangeSales);
    const totalSold = GET.sold(arrangeSales);

    setTotal({ ...totalSalesAndIncome, ...totalSold });
  }, [collections]);

  const handleIncome = (sale, isPerKilo) => {
    const { kilo, quantity, capital, srp } = sale;
    return isPerKilo
      ? srp * kilo - capital * kilo
      : srp * quantity - capital * quantity;
  };

  return (
    <section className="mb-4">
      <MDBRow>
        <MDBCol xl="3" md="6" className="mb-4 mb-r">
          <MDBCard>
            <MDBRow className="mt-3">
              <MDBCol md="5" size="5" className="text-left pl-4">
                <MDBBtn
                  tag="a"
                  floating
                  size="lg"
                  color="primary"
                  className="ml-4"
                  style={{ padding: 0 }}
                >
                  <MDBIcon icon="money-bill-wave" size="2x" />
                </MDBBtn>
              </MDBCol>
              <MDBCol md="7" col="7" className="text-right pr-5">
                <h5 className="ml-4 mt-4 mb-2 font-weight-bold text-nowrap">
                  ₱ {formattedTotal(total?.sales || 0)}{" "}
                </h5>
                <p className="font-small grey-text">Total Sales</p>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4 mb-r">
          <MDBCard>
            <MDBRow className="mt-3">
              <MDBCol md="5" col="5" className="text-left pl-4">
                <MDBBtn
                  tag="a"
                  floating
                  size="lg"
                  color="warning"
                  className="ml-4"
                  style={{ padding: 0 }}
                >
                  <MDBIcon icon="hand-holding-usd" size="2x" />
                </MDBBtn>
              </MDBCol>
              <MDBCol md="7" col="7" className="text-right pr-5">
                <h5 className="ml-4 mt-4 mb-2 font-weight-bold text-nowrap">
                  {" "}
                  ₱ {formattedTotal(total?.income || 0)}
                </h5>
                <p className="font-small grey-text">Total Income</p>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4 mb-r">
          <MDBCard>
            <MDBRow className="mt-3">
              <MDBCol md="5" col="5" className="text-left pl-4">
                <MDBBtn
                  tag="a"
                  floating
                  size="lg"
                  color="info"
                  className="ml-4"
                  style={{ padding: 0 }}
                >
                  <MDBIcon icon="table" size="2x" />
                </MDBBtn>
              </MDBCol>
              <MDBCol md="7" col="7" className="text-right pr-5">
                <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
                  {total?._soldQty?.toLocaleString() || 0}
                </h5>
                <p className="font-small grey-text">Total Sold in pcs</p>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-4 mb-r">
          <MDBCard>
            <MDBRow className="mt-3">
              <MDBCol md="5" col="5" className="text-left pl-4">
                <MDBBtn
                  tag="a"
                  floating
                  size="lg"
                  color="danger"
                  className="ml-4"
                  style={{ padding: 0 }}
                >
                  <MDBIcon icon="database" size="2x" />
                </MDBBtn>
              </MDBCol>
              <MDBCol md="7" col="7" className="text-right pr-5">
                <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
                  {total?._soldKilo?.toLocaleString() || 0}{" "}
                </h5>
                <p className="font-small grey-text">Total Sold in kg</p>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </section>
  );
};

export default Total;
