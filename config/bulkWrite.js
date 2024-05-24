const bulkWrite = (req, res, Entity, message, action = "updateOne") => {
  let options = [];

  for (const index in req.body) {
    const item = req.body[index];

    options.push({
      [action]: {
        filter: { _id: item._id },
        update: { $set: { ...item } },
      },
    });
  }

  Entity.bulkWrite(options)
    .then(() => {
      res.json({
        success: message,
        payload: req.body,
      });
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

module.exports = bulkWrite;
