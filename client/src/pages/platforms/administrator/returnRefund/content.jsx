import React, { useCallback, useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBCollapse,
  MDBCollapseHeader,
} from "mdbreact";
import CustomSelect from "../../../../components/customSelect";
import { fullName } from "../../../../services/utilities";
import Table from "./table";

const Content = ({ collections, isReturn = true, baseKey }) => {
  const [cashiers, setCashiers] = useState([]),
    [cashier, setCashier] = useState(""),
    [returnRefunds, setReturnRefunds] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1);

  const handleFilterByCashier = useCallback(
    (_cashier) => {
      return collections
        ? collections.filter((obj) => obj[baseKey]?._id === _cashier)
        : [];
    },
    [collections, baseKey]
  );

  useEffect(() => {
    setReturnRefunds(collections || []);
  }, [collections]);

  useEffect(() => {
    if (!!collections) {
      const _cashiers = collections.map((obj) => {
        const baseObject = obj[baseKey]; // Extract the object at baseKey
        return {
          ...baseObject,
          fullName: fullName(baseObject?.fullName), // Modify fullName using the fullName function
        };
      });
      setCashiers(_cashiers);
    }
  }, [collections, baseKey]);

  useEffect(() => {
    if (cashier && cashier !== "all") {
      setReturnRefunds(handleFilterByCashier(cashier) || []);
    } else {
      setReturnRefunds(collections || []);
    }
  }, [cashier, handleFilterByCashier, collections]);

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
                  fullName: "All",
                },
                ...cashiers,
              ]}
              texts="fullName"
              values="_id"
              onChange={(value) => setCashier(value)}
              inputClassName="text-center text-white m-0  "
              preValue="--"
            />
            <h6 className="mb-2 p-0 text-center mt-1">Cashier</h6>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBCard>
        <MDBCardBody>
          {!!returnRefunds &&
            returnRefunds.map((obj, index) => {
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
                        fullName(obj[baseKey]?.fullName) || "--"
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
                    <Table
                      collections={obj.arrangeByCashier}
                      baseKey={baseKey}
                      isReturn={isReturn}
                    />
                  </MDBCollapse>
                </div>
              );
            })}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Content;
