import React, { useCallback, useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBCollapse,
  MDBCollapseHeader,
} from "mdbreact";
import CustomSelect from "../../../../../components/customSelect";
import Table from "./table";
import filterBy from "../../filterBy";

const Approved = ({ collections = [], isAdmin, isReceived }) => {
  const [purchases, setPurchases] = useState([]),
    [activeId, setActiveId] = useState(-1),
    [suppliers, setSuppliers] = useState([]),
    [supplier, setSupplier] = useState(""),
    [didHoverId, setDidHoverId] = useState(-1);

  const handleArrangeData = useCallback((_collections = []) => {
    return (
      _collections.length > 0 &&
      _collections.reduce((acc, curr) => {
        const key = curr?.supplier?._id;
        const index = acc.findIndex(({ key: _key }) => _key === key);
        if (index > -1) {
          acc[index].stockmans.push(curr);
        } else {
          acc.push({ ...curr, stockmans: [curr], key });
        }
        return acc;
      }, [])
    );
  }, []);

  useEffect(() => {
    const hasRender =
      collections[0]?.status === "approved" ||
      collections[0]?.status === "received";
    if (collections.length > 0 && hasRender) {
      const arrangeData = handleArrangeData(collections);

      setPurchases(arrangeData || []);

      if (collections[0]?.supplier) {
        setSuppliers(filterBy("supplier", collections || []));
      }
    }
  }, [collections, handleArrangeData]);

  useEffect(() => {
    if (supplier === "all" || !supplier) {
      const _purchases = handleArrangeData(collections);
      setPurchases(_purchases || []);
    } else {
      const _purchases =
        (collections.length > 0 &&
          collections?.filter(
            ({ supplier: supp = {} }) => supp?._id === supplier
          )) ||
        [];
      setPurchases(handleArrangeData(_purchases || []));
    }
  }, [supplier, collections, handleArrangeData]);

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
                    <Table
                      stockmans={purchase.stockmans}
                      isAdmin={isAdmin}
                      isReceived={isReceived}
                    />
                  </MDBCollapse>
                </div>
              );
            })
          ) : (
            <h6 className="text-center">No Records.</h6>
          )}
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Approved;
