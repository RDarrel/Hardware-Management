const Entity = require("../../models/administrator/Products"),
  { v4: uuidv4 } = require("uuid"),
  fs = require("fs");

const upload = (name, _id, base64) => {
  const url = `./assets/products`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    fs.writeFileSync(`${url}/${name}-${_id}.jpg`, base64, "base64");
  } catch (error) {
    console.log(error.message);
  }
};

exports.browse = (req, res) =>
  Entity.find()
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      res.json({
        success: "Roles Fetched Successfully",
        payload: items,
      })
    )
    .catch((error) => res.status(400).json({ error: error.message }));

exports.save = (req, res) => {
  const { sizes = [], img = "" } = req.body;
  var sizesWithID = [];
  if (sizes.length > 0) {
    sizesWithID = sizes
      .map(
        ({ size, price }, index) =>
          size && {
            size,
            price,
            _id: `${uuidv4()}${index}`,
          }
      )
      .filter(Boolean);
  }
  Entity.create({ ...req.body, sizes: sizesWithID })
    .then((item) => {
      upload(item.name, item._id, img);
      res.status(201).json({
        success: "Product Created Successfully",
        payload: item,
      });
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));
};

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
