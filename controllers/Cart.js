const Entity = require("../models/Cart"),
  Purchase = require("../models/stockman/Purchases"),
  Quotations = require("../models/Quotations"),
  Notifications = require("../models/Notifications"),
  Merchandises = require("../models/stockman/Merchandises"),
  Suppliers = require("../models/administrator/Supplier"),
  handleDuplicate = require("../config/duplicate");

exports.browse = (req, res) =>
  Entity.find({ cartBy: req.query._id })
    .populate("product")
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Roles Fetched Successfully",
        payload: items.filter((item) => item.name !== "ADMINISTRATOR"),
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));

exports.save = async (req, res) => {
  try {
    const product = req.body;

    let createdProduct = {};
    const query = {
      cartBy: product.cartBy,
      product: product.product,
      ...(product.hasVariant && { variant1: product.variant1 }),
      ...(product.has2Variant && { variant2: product.variant2 }),
    };
    let isExisting = await Entity.findOne(query);
    if (isExisting?._id) {
      if (product.isPerKilo) {
        const existingKilo = isExisting.kilo || 0;
        const existingKiloGrams = isExisting.kiloGrams || 0;
        const newKilo = product.kilo || 0;
        const newKiloGrams = product.kiloGrams || 0;

        const newTotalKilo =
          existingKilo + existingKiloGrams + newKilo + newKiloGrams;

        const kilo = Math.trunc(newTotalKilo);
        const kiloGrams = parseFloat((newTotalKilo - kilo).toFixed(2));
        createdProduct = await Entity.findByIdAndUpdate(
          isExisting._id,
          { kilo, kiloGrams },
          { new: true }
        ).populate("product");
      } else {
        const newQuantity =
          (isExisting.quantity || 0) + (product.quantity || 0);

        createdProduct = await Entity.findByIdAndUpdate(
          isExisting._id,
          { quantity: newQuantity },
          { new: true }
        ).populate("product");
      }
    } else {
      const newProductCreated = await Entity.create(product);
      createdProduct = await Entity.findOne({
        _id: newProductCreated._id,
      }).populate("product");
    }
    res.status(201).json({
      success: "Added to cart successfully",
      payload: createdProduct,
    });
  } catch (error) {
    res.status(400).json({ error: handleDuplicate(error.message) });
  }
};

exports.changeVariant = async (req, res) => {
  try {
    const { _id, has2Variant = false, variant1, variant2 = "" } = req.body;
    const updatedObj = {
      variant1,
      ...(has2Variant && { variant2 }),
    };
    const updatedCart = await Entity.findByIdAndUpdate(_id, updatedObj, {
      new: true,
    }).populate("product");

    res.json({
      success: "Cart Updated Successfully",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      isOnChange = false,
      newQty = 1,
      action = "quantity",
      _id,
      newKilo = 1,
      operator = "MINUS",
      supplier,
      newKiloGrams = 0,
    } = req.body;
    var updatedCart = {};

    switch (action) {
      case "quantity":
        const oldQuantity = await Entity.findOne({ _id });
        if (isOnChange) {
          updatedCart = await Entity.findByIdAndUpdate(
            _id,
            { quantity: newQty },
            { new: true }
          ).populate("product");
        } else {
          updatedCart = await Entity.findByIdAndUpdate(
            _id,
            {
              quantity:
                operator === "ADD"
                  ? oldQuantity.quantity + 1
                  : oldQuantity.quantity > 1
                  ? oldQuantity.quantity - 1
                  : oldQuantity.quantity,
            },
            { new: true }
          ).populate("product");
        }
        break;
      case "kilo":
        updatedCart = await Entity.findByIdAndUpdate(
          _id,
          { kilo: newKilo },
          { new: true }
        ).populate("product");
        break;

      case "supplier":
        updatedCart = await Entity.findByIdAndUpdate(
          _id,
          { supplier },
          { new: true }
        );

      default:
        updatedCart = await Entity.findByIdAndUpdate(
          _id,
          { kiloGrams: newKiloGrams },
          { new: true }
        ).populate("product");
        break;
    }

    res.json({
      success: "Cart Updated Successfully",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      res.json({ success: "Successfuly Deleted Cart", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.suppliers = (_, res) => {
  Suppliers.find({ status: true })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Suppliers Fetched Successfully",
        payload: items,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.buy = async (req, res) => {
  try {
    // const { purchase, cart } = req.body;
    const { purchases, user, isAdmin = false } = req.body;

    for (const purchase of purchases) {
      const createdPurchase = await Purchase.create({
        ...purchase,
        type: "request",
        ...(isAdmin && { approved: new Date().toDateString() }),
      });

      const merchandisesWithPurchase = purchase.merchandises.map((obj) => ({
        ...obj,
        product: obj?.product?._id,
        purchase: createdPurchase._id,
        unitPrice: obj.price,
        ...(isAdmin && {
          kilo: { ...obj.kilo, defective: 0 },
          kiloGrams: { ...obj.kiloGrams, defective: 0 },
          quantity: {
            ...obj.quantity,
            defective: 0,
          },
        }),
      }));
      const idsToDelete = purchase.merchandises
        .map(({ _id }) => _id)
        .filter(Boolean);

      await Merchandises.insertMany(merchandisesWithPurchase);
      await Entity.deleteMany({ _id: { $in: idsToDelete } });
    }
    if (!isAdmin) {
      await Notifications.create({ user, type: "REQUEST" });
    }

    res.status(201).json({
      success: "Purchase is successful",
      payload: purchases,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.pre_order = async (req, res) => {
  try {
    const maxPreOrder = 3;
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const { orderBy = "", orders = [] } = req.body;
    var isLimit = false;
    const cartToDelete = orders.map(({ _id }) => _id).filter(Boolean);

    const quotations = await Quotations.find({
      orderBy,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (quotations.length >= maxPreOrder) {
      isLimit = true;
    } else {
      isLimit = false;
      await Quotations.create(req.body);
      await Entity.deleteMany({ _id: { $in: cartToDelete } });
    }
    return res.json({
      payload: {
        message: isLimit
          ? "Sorry, but the maximum pre-order limit is 3 per day."
          : "Pre-order placed successfully.",
        isLimit,
        orders: cartToDelete,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
