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

const handleVariantImagesUpload = (productID, variantImages) => {
  const options = variantImages.options;
  const optionsImages = options
    .map((option) => (option.img ? option : ""))
    .filter(Boolean);

  if (optionsImages.length > 0) {
    const url = `./assets/products/${productID}/variant`;

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

const handleUploadProduct = (_id, images) => {
  const url = `./assets/products/${_id}`;
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

const handleRemoveTheBase64 = (media) => {
  const product = media.product.map(({ label }) => ({
    label,
  }));
  const variant = media.variant.options.map(({ label, _id }) => ({
    _id,
    label,
  }));

  return { product, variant };
};

exports.save = (req, res) => {
  const product = req.body;
  const { media = {} } = product;
  const remveBase64InMediaProduct = handleRemoveTheBase64(media)?.product;
  const remveBase64InMediaOptions = handleRemoveTheBase64(media)?.variant;
  Entity.create({
    ...product,
    media: {
      product: remveBase64InMediaProduct,
      variant: { ...product.variant, options: remveBase64InMediaOptions },
    },
  })
    .then((item) => {
      handleUploadProduct(item._id, product?.media?.product);
      handleVariantImagesUpload(item._id, product?.media?.variant);

      res.status(201).json({
        success: "Product Created Successfully",
        payload: item,
      });
    })
    .catch((error) => res.status(400).json({ error: handleDuplicate(error) }));
};

exports.update = (req, res) => {
  const product = req.body;
  const { media = {}, _id } = product;

  const remveBase64InMediaProduct = handleRemoveTheBase64(media).product;
  const remveBase64InMediaOptions = handleRemoveTheBase64(media).variant;
  Entity.findByIdAndUpdate(
    _id,
    {
      ...product,
      media: {
        product: remveBase64InMediaProduct,
        variant: { options: remveBase64InMediaOptions },
      },
    },
    { new: true }
  )
    .then((item) => {
      if (item) {
        handleUploadProduct(item._id, product?.media?.product);
        handleVariantImagesUpload(item._id, product?.media?.variant);

        res.json({
          success: "Product Updated Successfully",
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
