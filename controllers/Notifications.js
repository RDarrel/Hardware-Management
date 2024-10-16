const Notification = require("../models/Notifications"),
  Stocks = require("../models/stockman/Stocks"),
  statusOfProducts = require("./stockman/statusOfProducts");

const getExpiredProducts = async () => {
  const currentDate = new Date();
  const expiredProducts = await Stocks.find({
    expirationDate: { $lte: currentDate },
    hasExpiration: true,
    hasExpired: false,
  }).populate("product");
  return expiredProducts;
};
exports.browse = async (req, res) => {
  const { nearlyExpired, outOfStocks: nearlyOutOfStocks } =
    await statusOfProducts();

  const outOfStocks = nearlyOutOfStocks.filter(({ stock = 0 }) => stock <= 0);
  try {
    const { role = "" } = req.query;
    const isStockman = role === "STOCKMAN";

    const notifications = await Notification.find({ forStockman: isStockman })
      .populate("user")
      .sort({ createdAt: -1 });

    if (role === "STOCKMAN") {
      if (nearlyExpired.length > 0) {
        notifications.push({
          type: "REQUEST",
          status: "NEARLY_EXPIRED_PRODUCT",
          _id: 1,
          additional: true,
        });
      }

      if (nearlyOutOfStocks.length > 0) {
        notifications.push({
          type: "REQUEST",

          status: "NEARLY_OUTOFSTOCK",
          additional: true,
          _id: 2,
        });
      }

      if (outOfStocks.length > 0) {
        notifications.push({
          type: "REQUEST",
          status: "OUTOFSTOCK",
          additional: true,
          _id: 3,
        });
      }

      if ((await getExpiredProducts()).length > 0) {
        notifications.push({
          type: "REQUEST",
          status: "EXPIRED",
          additional: true,
          _id: 4,
        });
      }
    }
    res.json({ payload: notifications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.destroy = (req, res) => {
  Notification.findByIdAndDelete(req.body._id)
    .then((item) => {
      res.json({ success: "Successfuly Deleted Product", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.update = async (req, res) => {
  try {
    const { notifications = [] } = req.body;
    const notificationIds = notifications.map(
      (notification) => notification._id
    );

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isSeen: true } }
    );

    const updatedNotifications = await Notification.find({
      _id: { $in: notificationIds },
    }).populate("user");

    res.status(200).json({ success: true, data: updatedNotifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating notifications", error });
  }
};
