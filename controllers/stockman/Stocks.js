const Entity = require("../../models/stockman/Stocks"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = async (_, res) => {
  try {
    const stocks = await Entity.find().populate("product");
    const computedStocks = stocks.reduce((accumulator, currentValue) => {
      const {
        kiloStock = 0,
        kiloGrams = 0,
        kilo = 0,
        quantityStock = 0,
        quantity = 0,
        product,
      } = currentValue;
      const key = `${currentValue.product._id}-${currentValue.variant1 || ""}-${
        currentValue.variant2 || ""
      }`;

      const index = accumulator.findIndex((accu) => accu.key === key);

      if (index > -1) {
        if (currentValue.product.isPerKilo) {
          accumulator[index].available += kiloStock > 0 ? kiloStock : 0;
          accumulator[index].beginning += kilo + kiloGrams;
          accumulator[index].sold += kilo + kiloGrams - kiloStock;
        } else {
          accumulator[index].available += quantityStock > 0 ? quantityStock : 0;
          accumulator[index].beginning += quantity;
          accumulator[index].sold += quantity - quantityStock;
        }
      } else {
        const { isPerKilo } = product;
        const sold = isPerKilo
          ? kilo + kiloGrams - kiloStock
          : quantity - quantityStock;
        accumulator.push({
          ...currentValue._doc,
          key,
          available: isPerKilo
            ? kiloStock > 0
              ? kiloStock
              : 0
            : quantityStock > 0
            ? quantityStock
            : 0,
          beginning: isPerKilo ? kilo + kiloGrams : quantity,
          sold,
        });
      }

      return accumulator;
    }, []);
    res.json({ payload: computedStocks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.save = (req, res) =>
  Entity.create(req.body)
    .then((item) =>
      res.status(201).json({
        success: "Supplier Created Successfully",
        payload: item,
      })
    )
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));

exports.update = (req, res) =>
  Entity.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((item) => {
      if (item) {
        res.json({
          success: "Role Updated Successfully",
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
