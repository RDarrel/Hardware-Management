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

const handleVariantImagesUpload = (productName, productID, variantImages) => {
  const options = variantImages.options;
  const optionsImages = options
    .map((option) => (option.img ? option : ""))
    .filter(Boolean);

  if (optionsImages.length > 0) {
    const url = `./assets/products/${productName}-${productID}/variant`;

    // const url = `./assets/products`;
    if (!fs.existsSync(url)) {
      fs.mkdirSync(url, { recursive: true });
    }
    try {
      optionsImages.forEach((element) => {
        fs.writeFileSync(`${url}/${element._id}.jpg`, element.img, "base64");
      });
    } catch (error) {
      console.log(error.message);
    }
  }
};

const handleUploadProduct = (name, _id, images) => {
  const url = `./assets/products/${name}-${_id}`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    images.forEach((element) => {
      fs.writeFileSync(`${url}/${element.label}.jpg`, element.img, "base64");
    });
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
  const product = req.body;
  const { media = {} } = product;
  const remveBase64InMediaProduct = media.product.map(({ label }) => ({
    label,
  }));
  const remveBase64InMediaOptions = media.variant.options.map(({ label }) => ({
    label,
  }));

  Entity.create({
    ...product,
    media: {
      product: remveBase64InMediaProduct,
      variant: { ...product.variant, option: remveBase64InMediaOptions },
    },
  })
    .then((item) => {
      handleUploadProduct(item.name, item._id, product?.media?.product);
      handleVariantImagesUpload(item.name, item._id, product?.media?.variant);

      res.status(201).json({
        success: "Product Created Successfully",
        payload: item,
      });
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));
};

exports.update = (req, res) => {
  const { sizes = [], img = "" } = req.body;
  var sizesWithID = [];
  if (sizes.length > 0) {
    sizesWithID = sizes
      .map(
        ({ size, price, _id = "" }, index) =>
          size && {
            size,
            price,
            _id: _id || `${uuidv4()}${index}`,
          }
      )
      .filter(Boolean);
  }
  Entity.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .then((item) => {
      if (item) {
        upload(item.name, item._id, img);

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
};

exports.variation_update = async (req, res) => {
  const {
    isDisable = false,
    has2Variant = false,
    productID,
    optionID,
    priceID,
    variantID,
  } = req.body;

  const updateQuery = {
    $set: {
      ...(has2Variant
        ? {
            "variations.$[variation].options.$[option].prices.$[price].disable":
              isDisable,
          }
        : {
            "variations.$[variation].options.$[option].disable": isDisable,
          }),
    },
  };

  const arrayFilters = [
    { "variation._id": variantID },
    { "option._id": optionID },
    ...(has2Variant ? [{ "price._id": priceID }] : []),
  ];

  try {
    const updatedItem = await Entity.findByIdAndUpdate(productID, updateQuery, {
      arrayFilters: arrayFilters,
      returnDocument: "after",
    });

    if (updatedItem) {
      res.json({
        success: "Role Updated Successfully",
        payload: updatedItem,
      });
    } else {
      res.status(404).json({
        error: "ID Not Found",
        message: "The provided ID does not exist.",
      });
    }
  } catch (error) {
    res.status(400).json({ error: handleDuplicate(error) });
  }
};

exports.destroy = (req, res) => {
  Entity.findByIdAndDelete(req.body._id)
    .then((item) => {
      res.json({ success: "Successfuly Deleted Product", payload: item });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
