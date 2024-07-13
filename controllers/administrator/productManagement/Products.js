const RemoveExpiredProducts = require("../../../config/removeExpiredProducts");
const sortByTopSellingProducts = require("../../../config/sortByTopSellingProducts");
const Entity = require("../../../models/administrator/productManagement/Products"),
  Stocks = require("../../../models/stockman/Stocks"),
  fs = require("fs");

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

exports.browse = async (req, res) => {
  try {
    const items = await Entity.find()
      .populate("category")
      .populate("material")
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    const sortedItems = await sortByTopSellingProducts(items);

    res.json({
      success: "Roles Fetched Successfully",
      payload: sortedItems,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTheTotalMax = (product, stocks) => {
  return (
    stocks.reduce((acc, curr) => {
      acc += product.isPerKilo ? curr.kiloStock : curr.quantityStock;
      return acc;
    }, 0) || 0
  );
};

const filteredVariations = async (product, options, has2Variant) => {
  const container = [];

  for (const option of options) {
    const { prices = [] } = option;

    if (has2Variant) {
      const pricesPromises = prices.map(async (price) => {
        const isExist = await Stocks.find({
          product: product._id,
          variant1: option._id,
          variant2: price._id,
        });

        if (isExist.length > 0) {
          const max = getTheTotalMax(product, isExist);
          if (max > 0) {
            return { ...price, max };
          } else {
            return false;
          }
        }
      });

      const resolvedPrices = await Promise.all(pricesPromises);
      const filteredPrices = resolvedPrices.filter(Boolean);
      if (filteredPrices.length > 0) {
        //ang ginagawa lang neto kukunin niya parin yung prices kahit walang stock pero magiging disable yun walang stock
        const newFilteredPrices = option.prices
          .map((price) => {
            const isExist = filteredPrices.find(({ _id }) => _id === price._id);
            if (isExist && isExist?.max > 0) {
              return isExist;
            } else {
              return false;
            }
          })
          .filter(Boolean);

        container.push({ ...option, prices: newFilteredPrices });
      }
    } else {
      const isExist = await Stocks.find({
        product: product._id,
        variant1: option._id,
      });

      if (isExist.length > 0) {
        const max = getTheTotalMax(product, isExist);
        if (max > 0) {
          container.push({ ...option, max });
        }
      }
    }
  }

  return container;
};

const mergePricesToLowestOptions = (options, optionsInVr2) => {
  try {
    const _options = [...options];
    for (const option of _options) {
      const { prices = [] } = option;
      const newPrices = [...prices];
      for (const optionInVr2 of optionsInVr2) {
        if (!newPrices.some(({ _id }) => _id === optionInVr2._id)) {
          newPrices.push({ ...optionInVr2, disable: true, max: 0 });
        }
      }
      const index = _options.findIndex(({ _id }) => option._id === _id);
      _options[index] = {
        ..._options[index],
        prices: newPrices,
      };
    }
    return _options;
  } catch (error) {
    console.log("Error in Merge Prices", error.message);
  }
};

exports.sellingProducts = async (_, res) => {
  try {
    await RemoveExpiredProducts();
    const products = await Entity.find();
    const container = [];

    for (const product of products) {
      const { has2Variant, hasVariant } = product;

      if (hasVariant) {
        const { variations = [] } = product;
        const options = [...variations[0].options];

        var filteredOptions = await filteredVariations(
          product,
          options,
          has2Variant
        );

        var optionsInVariant2 = {};
        if (has2Variant) {
          //para kunin yung pinaka maraming choices na prices para yun yung isoshow na available sa variant2
          optionsInVariant2 = filteredOptions.reduce((maxObj, currentObj) => {
            if (
              maxObj.prices &&
              maxObj.prices.length === currentObj.prices.length &&
              !maxObj.prices.every(
                (price, index) => price._id === currentObj.prices[index]._id
              )
            ) {
              // Merge the arrays if they have the same length but different values
              const newPrices = [
                ...new Set([...maxObj.prices, ...currentObj.prices]),
              ];

              return {
                ...maxObj,
                prices: newPrices,
              };
            } else {
              // Default condition
              return currentObj.prices.length > (maxObj.prices?.length || 0)
                ? currentObj
                : maxObj;
            }
          }, {});

          filteredOptions = mergePricesToLowestOptions(
            filteredOptions,
            optionsInVariant2.prices
          );
        }
        if (filteredOptions.length > 0) {
          container.push({
            ...product._doc,
            variations: [
              { ...variations[0], options: filteredOptions },
              has2Variant && {
                ...variations[1],
                options: optionsInVariant2.prices,
              },
            ],
          });
        }
      } else {
        const isExist = await Stocks.find({ product: product._id });
        if (isExist.length > 0) {
          const max = getTheTotalMax(product, isExist);
          if (max > 0) {
            container.push({ ...product._doc, max });
          }
        }
      }
    }

    // Step 5: Sort the container based on the sold property in descending order
    const sortedContainer = await sortByTopSellingProducts(container);
    res.status(200).json({
      payload: sortedContainer,
      success: "Successfully Fetch Selling Products",
    });
  } catch (error) {
    console.log("Error in selling products", error.message);
    res.status(400).json({ error: error.message });
  }
};

const handleRemoveTheBase64 = (media) => {
  const product = media.product.map(({ label }) => ({
    label,
  }));
  const variant = media.variant.options.map(({ label, _id, isUpload }) => ({
    _id,
    label,
    isUpload,
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
