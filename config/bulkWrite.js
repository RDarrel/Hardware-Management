const bulkWrite = (
  req,
  res,
  Entity,
  array = [],
  message,
  action = "updateOne"
) => {
  let options = [];
  const baseArray = array.length > 0 ? array : req.body;
  for (const index in baseArray) {
    const item = baseArray[index];

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
    .catch((error) => res.status(400).json({ error: error.message }));
};

module.exports = bulkWrite;
