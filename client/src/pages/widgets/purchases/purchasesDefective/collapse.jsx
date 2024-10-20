import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCollapse,
  MDBCollapseHeader,
} from "mdbreact";
import filterBy from "../filterBy";
import CustomSelect from "../../../../components/customSelect";
import GET from "../GET";
import DefectiveTable from "./defective/table";
import ReplacementTable from "./replacement/table";
import Spinner from "../../spinner";

const Collapse = ({
  collections = [],
  isAdmin,
  status = "defective",
  isDefective,
  isLoading,
}) => {
  const [purchases, setPurchases] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [suppliers, setSuppliers] = useState([]),
    [supplier, setSupplier] = useState(""),
    [didHoverId, setDidHoverId] = useState(-1);

  useEffect(() => {
    if (collections.length > 0) {
      const arrangeData = GET.arrangeData(collections);

      setPurchases(arrangeData || []);

      if (collections[0]?.supplier) {
        setSuppliers(filterBy("supplier", collections || []));
      }
    } else {
      setPurchases([]);
      setSuppliers([]);
    }
  }, [collections]);

  useEffect(() => {
    if (collections.length > 0) {
      GET.changeSupplier(supplier, collections, setPurchases);
    }
  }, [supplier, collections]);

  const renderTable = (purchase) => {
    switch (status) {
      case "defective":
        return (
          <DefectiveTable
            isAdmin={isAdmin}
            purchases={purchase.stockmans}
            isDefective={isDefective}
            isRefund={false}
          />
        );

      case "replacement":
        return (
          <ReplacementTable
            isAdmin={isAdmin}
            purchases={purchase.stockmans}
            isApproved={true}
            isDefective={isDefective}
            isRefund={false}
          />
        );

      case "received":
        return (
          <ReplacementTable
            isAdmin={isAdmin}
            isApproved={false}
            purchases={purchase.stockmans}
            isReceived={true}
            isRefund={false}
          />
        );
      default:
        return (
          <DefectiveTable
            isAdmin={isAdmin}
            purchases={purchase.stockmans}
            isRefund={true}
          />
        );
    }
  };
  return (
    <>
      <MDBRow className="ml-3  text-white">
        <MDBCol className="m-0 p-0">
          <div className="w-25">
            <CustomSelect
              className="m-0 p-0 "
              choices={[
                {
                  _id: "all",
                  company: "All",
                },
                ...suppliers,
              ]}
              texts="company"
              values="_id"
              onChange={(value) => setSupplier(value)}
              inputClassName="text-center text-white m-0  "
              preValue="--"
            />
            <h6 className="mb-2 p-0 text-center mt-1">Suplier</h6>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBCard>
        <MDBCardBody>
          {!isLoading ? (
            <>
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => {
                  const textColor =
                    activeId !== index
                      ? didHoverId === index
                        ? "text-primary"
                        : "text-black"
                      : "text-white";

                  const bgBorder =
                    activeId === index
                      ? " bg-info transition"
                      : didHoverId === index
                      ? "rounded border border-info bg-transparent ease-out"
                      : "bg-transparent ease-out";

                  return (
                    <div
                      key={index}
                      className="mt-2"
                      onMouseLeave={() => setDidHoverId(-1)}
                      onMouseEnter={() => setDidHoverId(index)}
                    >
                      <MDBCollapseHeader
                        className={bgBorder}
                        onClick={() => {
                          setActiveId((prev) => (prev === index ? -1 : index));
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <label className={textColor}>{`${index + 1}. ${
                            purchase?.supplier?.company || "--"
                          }`}</label>
                          <div className="d-flex align-items-center">
                            <i
                              style={{
                                rotate: `${activeId === index ? 0 : 90}deg`,
                              }}
                              className={`fa fa-angle-down transition-all ${textColor}`}
                            />
                          </div>
                        </div>
                      </MDBCollapseHeader>
                      <MDBCollapse
                        id={`collapse-${index}`}
                        isOpen={index === activeId}
                        className="border border-black"
                      >
                        {renderTable(purchase)}
                      </MDBCollapse>
                    </div>
                  );
                })
              ) : (
                <h6 className="text-center">No Records.</h6>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Collapse;
