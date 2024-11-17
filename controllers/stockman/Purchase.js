const bulkWrite = require("../../config/bulkWrite");
const Entity = require("../../models/stockman/Purchases"),
  Cart = require("../../models/Cart"),
  Notifications = require("../../models/Notifications"),
  Stocks = require("../../models/stockman/Stocks"),
  Merchandises = require("../../models/stockman/Merchandises"),
  Audit = require("../../models/administrator/Audit"),
  handleDuplicate = require("../../config/duplicate");

var notifications = [];

var purchasesDefectOrDisc = []; //purchases defective,purchases discrepancy

const handleNotification = async ({
  type = "REQUEST",
  status = "APPROVED",
  user,
  forStockman = true,
}) => {
  try {
    const notif = await Notifications.create({
      forStockman,
      type,
      status,
      user,
    });

    const populateNotification = await Notifications.findOne({
      _id: notif._id,
    }).populate("user");

    notifications.unshift(populateNotification);
  } catch (error) {
    console.log("Error in notification in purchase:", error.message);
  }
};

const handleAudit = async (purchase) => {
  try {
    const {
      type: _type,
      status: stats,
      requestBy,
      total = 0,
      employee = "",
      supplier = "",
    } = purchase;

    const status = stats.toUpperCase();
    const type = _type.toUpperCase();
    if (type === "REQUEST") {
      switch (status) {
        case "APPROVED":
          await Audit.create({
            employee: "665354bee6f3d0c154c02c03",
            action: "APPROVED",
            description: `Approved ${employee}'s purchase request from ${supplier}.`,
            amount: total,
          });
          break;

        case "RECEIVED":
          await Audit.create({
            employee: requestBy,
            action: "RECEIVED",
            description: `Received products from ${supplier}.`,
            amount: total,
          });
          break;

        default:
          break;
      }
    } else if (type === "DEFECTIVE") {
      await Audit.create({
        employee: requestBy,
        action: "RECEIVED",
        description: `Received defective products from ${supplier}.`,
        amount: total,
      });
    } else {
      await Audit.create({
        employee: requestBy,
        action: "RECEIVED",
        description: `Received discrepancy products from ${supplier}.`,
        amount: total,
      });
    }
  } catch (error) {
    console.log("Error in audit trails:", error.message);
  }
};

const populateMerchandises = async (merchandises) => {
  try {
    return await Merchandises.find({
      _id: { $in: merchandises.map((m) => m._id) },
    }).populate("product");
  } catch (error) {
    console.log("Error in populate merchandises:", error.message);
  }
};

const populatePurchase = async (purchase) => {
  try {
    return await Entity.findOne({ _id: purchase._id })
      .populate("supplier")
      .populate("requestBy");
  } catch (error) {
    console.log("Error in populate purchase:", error.message);
  }
};

const resetDefectOrDiscPurchases = () => {
  purchasesDefectOrDisc = [];
};

const resetNotifications = () => {
  notifications = [];
};

exports.browse = async (req, res) => {
  try {
    const status = req.query.status;
    const type = req.query.type;
    const filter =
      req.query.isAdmin === "true"
        ? { status }
        : {
            status,
          };

    const purchases = await Entity.find({ ...filter, type })
      .populate("requestBy")
      .populate("supplier")
      .select("-__v")
      .sort({
        ...(status === "pending" ? { expected: 1 } : { expectedDelivered: 1 }),
      })
      .sort({ createdAt: 1 })
      .lean();
    // const container = [];

    const container = await Promise.all(
      purchases.map(async (element) => {
        const merchandises = await Merchandises.find({
          purchase: element._id,
        }).populate("product");

        return { ...element, merchandises };
      })
    );
    res.json({ success: "Successfully fetched Purchase", payload: container });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTheTotalAmount = (merchandises, isDefective = false) => {
  const baseKey = isDefective ? "defective" : "approved";
  const merchandisesWithSubtotal = merchandises.map(
    ({ quantity, capital, product, kilo, kiloGrams }) =>
      !product.isPerKilo
        ? quantity[baseKey] * capital
        : ((kilo[baseKey] || 0) + (kiloGrams[baseKey] || 0)) * capital
  );
  return merchandisesWithSubtotal.reduce((acc, curr) => {
    acc += curr;
    return acc;
  }, 0);
};

const defectiveCheckpoint = async (_purchase, merchandises) => {
  try {
    const { _id, ...purchase } = _purchase;
    const defectiveMerchandises = merchandises
      .map((merchandise) => {
        const { quantity, kilo, kiloGrams } = merchandise;
        if (quantity.defective > 0) {
          return {
            ...merchandise,
            quantity: {
              received: quantity.defective,
              approved: quantity.defective,
              defective: quantity.defective,
            },
          };
        } else if (kilo.defective > 0 || kiloGrams.defective > 0) {
          const newKilo = kilo.defective || 0;
          const newKiloGrams = kiloGrams.defective || 0;
          return {
            ...merchandise,
            kilo: { approved: newKilo, received: newKilo, defective: newKilo },
            kiloGrams: {
              approved: newKiloGrams,
              received: newKiloGrams,
              defective: newKiloGrams,
            },
          };
        } else {
          return false;
        }
      })
      .filter(Boolean);

    if (defectiveMerchandises.length > 0) {
      const total = getTheTotalAmount(defectiveMerchandises, true);
      const defectivePurchase = await Entity.create({
        ...purchase,
        type: "defective",
        status: "pending",
        total,
      });

      const createdMerchandises = await Merchandises.insertMany(
        defectiveMerchandises.map((merchandise) => {
          delete merchandise._id;
          return {
            ...merchandise,
            purchase: defectivePurchase._id,
          };
        })
      );

      const _populatePurchase = await populatePurchase(defectivePurchase);

      purchasesDefectOrDisc.push({
        ..._populatePurchase._doc,
        merchandises: await populateMerchandises(createdMerchandises),
      });

      await handleAudit({
        ...purchase,
        total,
        type: "DEFECTIVE",
        supplier: purchase.supplier.company,
        status: "RECEIVED",
      });

      await handleNotification({
        type: "DEFECTIVE",
        status: "DEFECTIVE",
        forStockman: false,
        user: _purchase.requestBy,
      });
    }
  } catch (error) {
    console.log("Error for defective checkpoint", error.message);
  }
};

const getMerchandisesDisrepancy = (merchandises) => {
  try {
    const merchandisesDiscrepancy = merchandises.filter((merchandise) => {
      const {
        quantity = { approved: 0, received: 0 },
        kilo = { approved: 0, received: 0 },
        kiloGrams = { approved: 0, received: 0 },
        product,
      } = merchandise;
      const { isPerKilo = false } = product;
      const totalKiloRecieved = kilo.received + kiloGrams.received;
      const totalKiloApproved = kilo.approved + kiloGrams.approved;
      const totalQtyRecieved = quantity.received;
      const totalQtyApproved = quantity.approved;
      if (isPerKilo) {
        return totalKiloApproved !== totalKiloRecieved;
      } else {
        return totalQtyApproved !== totalQtyRecieved;
      }
    });

    if (merchandisesDiscrepancy.length === 0) return [];

    //it means the merchandises we have a discrepancy
    return merchandisesDiscrepancy.map((merchandise) => {
      const {
        quantity = {
          approved: 0,
          received: 0,
        },
        kilo = {
          approved: 0,
          received: 0,
        },
        kiloGrams = {
          approved: 0,
          received: 0,
        },
        product,
      } = merchandise;
      const { isPerKilo = false } = product;

      if (isPerKilo) {
        const overAllDiscrepancyKilo = newKiloStocksInsert(
          kiloGrams.approved,
          kilo.approved,
          kiloGrams.received,
          kilo.received
        );
        const newKilo = overAllDiscrepancyKilo.kilo;
        const newKiloGrams = overAllDiscrepancyKilo.kiloGrams;
        return {
          ...merchandise,
          kilo: {
            approved: newKilo,
            received: newKilo,
            replenishment: newKilo,
          },
          kiloGrams: {
            approved: newKiloGrams,
            received: newKiloGrams,
            replenishment: newKiloGrams,
          },
        };
      } else {
        const newQuantity = quantity.approved - quantity.received;
        return {
          ...merchandise,
          quantity: {
            approved: newQuantity,
            received: newQuantity,
            replenishment: newQuantity,
          },
        };
      }
    });
  } catch (error) {
    console.log("Get discrepancy Error:", error.message);
  }
};

const discrepancyCheckPoint = async (_purchase, merchandises) => {
  const { _id, ...purchase } = _purchase;
  const merchandisesWithDiscrepancy = getMerchandisesDisrepancy(merchandises);
  try {
    if (merchandisesWithDiscrepancy.length > 0) {
      //it means the merchandises we have a discrepancy
      const newPurchase = await Entity.create({
        ...purchase,
        type: "discrepancy",
        status: "pending",
      });

      const merchandisesWithPurchase = merchandisesWithDiscrepancy.map(
        (merchandise) => {
          const { _id, ...rest } = merchandise;
          return {
            ...rest,
            purchase: newPurchase._id,
          };
        }
      );

      const total = getTheTotalAmount(merchandisesWithDiscrepancy);

      await Entity.findByIdAndUpdate(newPurchase._id, {
        total,
      });

      const createdMerchandises = await Merchandises.insertMany(
        merchandisesWithPurchase
      );

      const _populatePurchase = await populatePurchase(newPurchase);

      purchasesDefectOrDisc.push({
        ..._populatePurchase._doc,
        merchandises: await populateMerchandises(createdMerchandises),
      });

      await handleAudit({
        ...purchase,
        total,
        type: "DISCREPANCY",
        supplier: purchase.supplier.company,
        status: "RECEIVED",
      });

      await handleNotification({
        type: "DISCREPANCY",
        status: "DISCREPANCY",
        forStockman: false,
        user: _purchase.requestBy,
      });
    }
  } catch (error) {
    console.log("Error for discrepancy Checkpoint", error.message);
  }
};

const mergeDiscrepancyInOriginalPurchase = (merchandises) => {
  const _merchandises = [...merchandises];
  const merchandisesWithDiscrepancy = getMerchandisesDisrepancy(merchandises);
  if (merchandises.length === 0) return merchandises;
  for (const discrepancy of merchandisesWithDiscrepancy) {
    const {
      product,
      _id: discrepancyID,
      kilo: discrepancyKilo,
      kiloGrams: discrepancyKiloGrams,
      quantity: discrepancyQuantity,
    } = discrepancy;
    const index = merchandises.findIndex(({ _id }) => _id === discrepancyID);
    if (index > -1) {
      if (product.isPerKilo) {
        const { kilo, kiloGrams } = merchandises[index];
        _merchandises[index] = {
          ...merchandises[index],
          kilo: { ...kilo, discrepancy: discrepancyKilo.approved },
          kiloGrams: {
            ...kiloGrams,
            discrepancy: discrepancyKiloGrams.approved,
          },
        };
      } else {
        const { quantity } = merchandises[index];
        _merchandises[index] = {
          ...merchandises[index],
          quantity: {
            ...quantity,
            discrepancy: discrepancyQuantity?.approved,
          },
        };
      }
    } else {
      console.log("No found index in discrepancy");
    }
  }
  return _merchandises;
};

const gramsConverter = (grams) => {
  switch (grams) {
    case 5:
      return 0.5;
    case 75:
      return 0.75;
    case 25:
      return 0.25;
    default:
      return grams;
  }
};

const newKiloStocksInsert = (
  _kiloGrams = 0,
  _kilo = 0,
  kiloGramsDefect = 0,
  kiloDefect = 0
) => {
  const totalKiloAndGramsDefect = kiloGramsDefect + kiloDefect;
  const totalKiloAndGrams = _kiloGrams + _kilo;
  const newTotalKiloAndGramsRes = totalKiloAndGrams - totalKiloAndGramsDefect;
  var newKilo = 0;
  var newKiloGrams = 0;
  if (newTotalKiloAndGramsRes < 1) {
    newKilo = 0;
    newKiloGrams = newTotalKiloAndGramsRes;
  } else {
    const totalDeducConvertInArray = String(newTotalKiloAndGramsRes).split(".");
    newKilo = Number(totalDeducConvertInArray[0] || 0);
    newKiloGrams = Number(totalDeducConvertInArray[1] || 0);
  }
  return {
    kilo: newKilo || 0,
    kiloGrams: gramsConverter(newKiloGrams),
    kiloStock: newTotalKiloAndGramsRes,
  };
};

exports.save = async (req, res) => {
  try {
    const { purchase, cart } = req.body;

    const createdPurchase = await Entity.create({
      ...purchase,
      type: "request",
    });
    const cartWithPurchaseID = cart.map((obj) => ({
      ...obj,
      product: obj?._id,
      purchase: createdPurchase._id,
      unitPrice: obj.price,
    }));

    const idsToDelete = cart.map(({ _id }) => _id).filter(Boolean);

    await Stocks.insertMany(cartWithPurchaseID);
    await Cart.deleteMany({ _id: { $in: idsToDelete } });

    res.status(201).json({
      success: "Purchase is successful",
      payload: createdPurchase,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findSupplierWithMostMerchandises = (suppliers) => {
  return suppliers.reduce((maxSupplier, currentSupplier) => {
    return currentSupplier.merchandises.length > maxSupplier.merchandises.length
      ? currentSupplier
      : maxSupplier;
  }, suppliers[0]);
};

exports.approved = async (req, res) => {
  try {
    const { suppliers, purchase } = req.body;
    const _suppliers = [...suppliers];

    const supplierWithMostProducts =
      findSupplierWithMostMerchandises(_suppliers);
    const index = _suppliers.findIndex(
      ({ _id }) => _id === supplierWithMostProducts._id
    );

    _suppliers.splice(index, 1);

    await Entity.findByIdAndUpdate(purchase._id, {
      approved: new Date().toDateString(),
      status: "approved",
      supplier: supplierWithMostProducts._id,
      total: supplierWithMostProducts.totalAmount,
      expectedDelivered: supplierWithMostProducts.expectedDelivered,
    });

    await handleAudit({
      ...purchase,
      type: "REQUEST",
      status: "APPROVED",
      total: supplierWithMostProducts.totalAmount,
      supplier: supplierWithMostProducts.company,
    });

    if (_suppliers.length > 0) {
      for (const supplier of _suppliers) {
        const newPurchase = await Entity.create({
          supplier: supplier._id,
          expectedDelivered: supplier.expectedDelivered,
          expected: purchase.expected,
          requestBy: purchase.requestBy,
          approved: new Date().toDateString(),
          status: "approved",
          type: "request",
          total: supplier.totalAmount,
        });

        await handleAudit({
          ...purchase,
          type: "REQUEST",
          status: "APPROVED",
          total: newPurchase.total,
          supplier: supplier.company,
        });

        const updatePromises = supplier.merchandises.map((merchandise) => {
          return Merchandises.findByIdAndUpdate(merchandise._id, {
            ...merchandise,
            purchase: newPurchase._id,
          });
        });

        await Promise.all(updatePromises);
      }
    }

    resetNotifications();

    await handleNotification({
      type: "REQUEST",
      status: "APPROVED",
      forStockman: true,
      user: purchase.requestBy,
    });

    bulkWrite({
      req,
      res,
      Entity: Merchandises,
      array: supplierWithMostProducts.merchandises,
      notifications,
      message: "Successfully Approved",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { purchase, merchandises = [] } = req.body;
    const basePurchase = Entity;
    const baseMerchandises = Merchandises;
    await basePurchase.findByIdAndUpdate(purchase._id, purchase);

    if (purchase.status === "approved" || purchase.status === "replacement") {
      const { status, type } = purchase || {};
      await handleNotification({
        user: purchase.requestBy,
        type: type?.toUpperCase(),
        status: status.toUpperCase(),
        forStockman: true,
      });

      bulkWrite({
        req,
        res,
        Entity: baseMerchandises,
        array: merchandises,
        message: "Successfully Approved",
        notifications,
      });
    } else if (purchase.status === "received") {
      await handleAudit({
        ...purchase,
        total: purchase.totalReceived,
        type: "REQUEST",
        supplier: purchase.supplier.company,
        status: "RECEIVED",
      });
      resetNotifications();
      resetDefectOrDiscPurchases();
      await defectiveCheckpoint(purchase, merchandises);
      await discrepancyCheckPoint(purchase, merchandises);
      await Promise.all(
        merchandises.map(async (merchandise) => {
          const {
            product,
            quantity,
            kilo,
            kiloGrams,
            capital,
            expiration,
            variant1 = "",
            variant2 = "",
          } = merchandise;
          const { received: qtyReceived = 0, defective: qtyDefective } =
            quantity;
          const { received: kiloReceived = 0, defective: kiloDefective = 0 } =
            kilo;
          const {
            received: kiloGramsReceived = 0,
            defective: kiloGramsDefective = 0,
          } = kiloGrams;

          try {
            const stocksData = {
              capital,
              product: product._id,
              ...(product.hasVariant
                ? product.has2Variant
                  ? { variant1, variant2 }
                  : { variant1 }
                : {}),
              ...(product.isPerKilo
                ? {
                    ...newKiloStocksInsert(
                      kiloGramsReceived,
                      kiloReceived,
                      kiloGramsDefective,
                      kiloDefective
                    ),
                  }
                : {
                    quantity: qtyReceived - qtyDefective,
                    quantityStock: qtyReceived - qtyDefective,
                  }),
              ...(product?.hasExpiration && {
                expirationDate: new Date(expiration),
                hasExpiration: true,
              }),
            };
            await Stocks.create(stocksData);
          } catch (error) {
            console.error("Error creating stock:", error.message);
          }
        })
      );

      bulkWrite({
        req,
        res,
        Entity: baseMerchandises,
        array: mergeDiscrepancyInOriginalPurchase(merchandises),
        message: "Successfully Approved",
        notifications,
        purchases: purchasesDefectOrDisc,
      });
    } else {
      await handleNotification({
        type: "REQUEST",
        status: "REJECT",
        forStockman: true,
        user: purchase.requestBy,
      });
      res.json({ success: "Successfully Rejected", payload: { purchase } });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.status = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((item) => {
      if (item) {
        res.json({
          success: `Supplier has been ${
            req.body.status ? "Active" : "Inactive"
          } Successfully`,
          payload: item,
        });
      } else {
        res.status(404).json({
          error: "ID Not Found",
          message: "The provided ID does not exist.",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.destroy = (req, res) => {
  Entity.findByIdAndDelete(req.body._id)
    .then((item) => {
      res.json({ success: "Successfuly Deleted Product", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
