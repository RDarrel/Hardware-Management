const Notifications = require("../models/Notifications");

exports.browse = async (req, res) => {
  try {
    const notifications = await Notifications.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ payload: notifications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
