const bulkWrite = require("../../config/bulkWrite");
const Entity = require("../../models/stockman/Purchases"),
  Cart = require("../../models/Cart"),
  Stocks = require("../../models/stockman/Stocks"),
  Merchandises = require("../../models/stockman/Merchandises"),
  DefectiveMerchandises = require("../../models/stockman/DefectiveMerchandises"),
  DefectivePurchases = require("../../models/stockman/DefectivePurchases"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = async (req, res) => {
  try {
    const status = req.query.status;
    const filter =
      req.query.isAdmin === "true"
        ? { status }
        : { requestBy: req.query.requestBy, status };

    const purchases = await Entity.find(filter)
      .populate("requestBy")
      .populate("supplier")
      .select("-__v")
      .sort({
        ...(status === "pending" ? { expected: 1 } : { expectedDelivered: 1 }),
      });
    const container = [];

    for (const element of purchases) {
      const merchandises = await Merchandises.find({
        purchase: element._id,
      }).populate("product");

      container.push({ ...element._doc, merchandises });
    }
    res.json({ success: "Successfully fetched Purchase", payload: container });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTheTotalAmountOfDefective = (merchandises) => {
  const merchandisesWithSubtotal = merchandises.map(
    ({ quantity, capital, product, kilo, kiloGrams }) =>
      !product.isPerKilo
        ? quantity.defective * capital
        : ((kilo?.defective || 0) + (kiloGrams?.defective || 0)) * capital
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
            quantity: { defective: quantity.defective },
          };
        } else if (kilo.defective > 0 || kiloGrams.defective > 0) {
          return {
            ...merchandise,
            kilo: { defective: kilo.defective || 0 },
            kiloGrams: { defective: kiloGrams.defective || 0 },
          };
        } else {
          return false;
        }
      })
      .filter(Boolean);

    if (defectiveMerchandises.length > 0) {
      const total = getTheTotalAmountOfDefective(defectiveMerchandises);
      const defectivePurchase = await DefectivePurchases.create({
        ...purchase,
        status: "defective",
        total,
      });

      await DefectiveMerchandises.insertMany(
        defectiveMerchandises.map((merchandise) => {
          delete merchandise._id;
          return {
            ...merchandise,
            purchase: defectivePurchase._id,
          };
        })
      );
    }
  } catch (error) {
    console.log("Error for defective checkpoint", error.message);
  }
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

    const createdPurchase = await Entity.create(purchase);
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

exports.update = async (req, res) => {
  try {
    const { purchase, merchandises = [], isDefective = false } = req.body;
    const basePurchase = isDefective ? DefectivePurchases : Entity;
    const baseMerchandises = isDefective ? DefectiveMerchandises : Merchandises;
    await basePurchase.findByIdAndUpdate(purchase._id, purchase);
    if (purchase.status === "approved" || purchase.status === "replacement") {
      bulkWrite(
        req,
        res,
        baseMerchandises,
        merchandises,
        "Successfully Approved"
      );
    } else if (purchase.status === "received") {
      defectiveCheckpoint(purchase, merchandises);
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

      bulkWrite(
        req,
        res,
        baseMerchandises,
        merchandises,
        "Successfully Approved"
      );
    } else {
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
