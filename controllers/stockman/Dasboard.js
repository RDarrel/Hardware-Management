const Entity = require("../../models/administrator/Supplier"),
  Stocks = require("../../models/stockman/Stocks"),
  RemoveExpiredProducts = require("../../config/removeExpiredProducts"),
  handleDuplicate = require("../../config/duplicate");

exports.browse = async (req, res) => {
  try {
    await RemoveExpiredProducts();
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const nearlyExpired = await Stocks.find({
      hasExpiration: true,
      hasExpired: false,
      expirationDate: {
        $gte: currentDate,
        $lte: oneMonthFromNow,
      },
    }).populate("product");

    const outOfStocks = await Stocks.find().populate("product");

    const arrangeStocks =
      outOfStocks.length > 0
        ? outOfStocks.reduce((acc, curr) => {
            const {
              variant1 = "",
              variant2 = "",
              product,
              quantityStock = 0,
              kiloStock = 0,
            } = curr;

            const key = `${product._id}-${variant1}-${variant2}`;
            const index = acc.findIndex(({ key: _key }) => _key == key);
            if (index > -1) {
              acc[index].stock += product.isPerKilo ? kiloStock : quantityStock;
            } else {
              acc.push({
                ...curr._doc,
                key,
                stock: product.isPerKilo ? kiloStock : quantityStock,
              });
            }

            return acc;
          }, [])
        : [];

    const productOutOfStocks =
      arrangeStocks.length > 0
        ? arrangeStocks
            .filter(({ stock }) => stock <= 20)
            .sort((a, b) => a.stock - b.stock)
        : [];
    res.json({ payload: { nearlyExpired, outOfStocks: productOutOfStocks } });
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
