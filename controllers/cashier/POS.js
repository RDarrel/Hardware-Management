const e = require("cors");
const Sales = require("../../models/administrator/report/Sales"),
  Stocks = require("../../models/stockman/Stocks"),
  Transactions = require("../../models/administrator/report/Transactions"),
  Cart = require("../../models/Cart"),
  handleDuplicate = require("../../config/duplicate");

const checkerOfLastStock = async (productID, currentStock) => {
  try {
    const stocks = await Stocks.find({ product: productID });
    const index = stocks.findIndex(
      ({ _id }) => String(currentStock._id) === String(_id)
    );

    return index === stocks.length - 1;
  } catch (error) {
    console.log("Checker of last stock Error", error.message);
  }
};

const findAnotherStock = async (stock, query) => {
  try {
    return await Stocks.findOne({
      ...query,
      _id: { $ne: stock._id },
    }).sort({ createdAt: 1 });
  } catch (error) {
    console.log("Find another stock Error", error.message);
  }
};

const updateStock = async (stock, key, newStock) => {
  try {
    await Stocks.findByIdAndUpdate(
      stock._id,
      {
        [key]: newStock,
      },
      { new: true }
    );
  } catch (error) {
    console.log("Update Stock error", error.message);
  }
};

const stocksPerQuantity = async (
  stock,
  purchase,
  purchasesWithCapital,
  invoice_no,
  baseStockIsNotEnough
) => {
  var {
    quantity: purchaseQty,
    kilo = 0,
    kiloGrams = 0,
    product,
    variant1,
    variant2,
  } = purchase;
  const { has2Variant, hasVariant, _id, isPerKilo } = product;

  const baseStockKey = isPerKilo ? "kiloStock" : "quantityStock";
  const basePurchaseKey = isPerKilo ? "kilo" : "quantity";
  var basePurchase = isPerKilo ? kilo + kiloGrams : purchaseQty;

  const query = {
    product: _id,
    [baseStockKey]: { $gt: 0 },
    ...(hasVariant && { variant1: variant1 }),
    ...(has2Variant && { variant2: variant2 }),
  };

  try {
    var isLoopAgain = true;
    var hasLastStock = false;
    while (isLoopAgain) {
      const stocks = await Stocks.find({ product: product._id });

      const stockIsEnough = stock[baseStockKey] >= basePurchase;
      var remainingStock = stock[baseStockKey] - basePurchase;
      const have1Stock = stocks.length === 1;

      const shouldAdjustPurchase =
        !stockIsEnough && !have1Stock && !hasLastStock && !baseStockIsNotEnough; // if this is true it means have another stock

      purchasesWithCapital.push({
        ...purchase,
        capital: stock.capital,
        [basePurchaseKey]: Number(
          shouldAdjustPurchase
            ? basePurchase - Math.abs(remainingStock) //cinoconvert ko siya sa positive kapag -2 magiging 2
            : basePurchase
        ).toFixed(2),
        product: _id,
        invoice_no,
      });

      const newStockCount = shouldAdjustPurchase ? 0 : remainingStock;
      await updateStock(stock, baseStockKey, newStockCount);

      if (shouldAdjustPurchase) {
        var nextStock = await findAnotherStock(stock, query);

        const hasNoMoreStock = await checkerOfLastStock(product._id, nextStock);
        let nextStockRemainingQty =
          nextStock[baseStockKey] - Math.abs(remainingStock);

        purchasesWithCapital.push({
          ...purchase,
          capital: nextStock.capital,
          [basePurchaseKey]: Number(
            hasNoMoreStock
              ? Math.abs(remainingStock)
              : nextStockRemainingQty < 0
              ? nextStock[baseStockKey]
              : Math.abs(remainingStock)
          ).toFixed(2),
          product: _id,
          invoice_no,
        });

        const nextStockCount = //kung ilang stock ang ilalagay sa iuupdate na stock
          nextStockRemainingQty < 0 && !hasNoMoreStock
            ? 0
            : nextStockRemainingQty;

        await updateStock(nextStock, baseStockKey, nextStockCount);

        if (nextStockRemainingQty < 0 && !hasNoMoreStock) {
          basePurchase = Math.abs(nextStockRemainingQty);
          stock = await findAnotherStock(nextStock, query);

          if (await checkerOfLastStock(product._id, stock)) {
            hasLastStock = true; //if this is true it means the stock is last
          }

          isLoopAgain = true;
        } else {
          isLoopAgain = false;
        }
      } else {
        isLoopAgain = false;
      }
    }
  } catch (error) {
    console.log(`Error Per Quantity:${error.message}`);
  }
};

const stocks = async (purchases, invoice_no) => {
  try {
    const purchasesWithCapital = [];
    for (const purchase of purchases) {
      delete purchase._id;
      const { variant1 = "", variant2 = "", product } = purchase;
      const { _id, isPerKilo, has2Variant, hasVariant } = product;
      var baseStockIsNotEnough = false;
      var query = {
        product: _id,
        ...(!isPerKilo && { quantityStock: { $gt: 0 } }),
        ...(isPerKilo && { kiloStock: { $gt: 0 } }),
        ...(hasVariant && { variant1: variant1 }),
        ...(has2Variant && { variant2: variant2 }),
      };

      var stock = await Stocks.findOne(query).sort({ createdAt: 1 });
      if (!stock) {
        delete query.quantityStock;
        delete query.kiloStock;
        baseStockIsNotEnough = true;
        //para kapag wala siyang mahanap na meron pang stock mag nenegative siya sa pinaka unang nabili na stock
        stock = await Stocks.findOne(query).sort({ createdAt: -1 });
      } else {
        const haveAnotherStock = await findAnotherStock(stock, query);
        if (!haveAnotherStock) {
          baseStockIsNotEnough = true;
        } else {
          baseStockIsNotEnough = false;
        } //to check don't have another stock
      }

      await stocksPerQuantity(
        stock,
        purchase,
        purchasesWithCapital,
        invoice_no,
        baseStockIsNotEnough
      );
    }

    return purchasesWithCapital;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};

exports.pos = async (req, res) => {
  try {
    const { purchases, invoice_no, cashier, total } = req.body;
    const purchasesWithCapital = await stocks(purchases, invoice_no);
    await Sales.insertMany(purchasesWithCapital);
    await Transactions.create({
      cashier,
      invoice_no,
      total,
      purchases,
    });

    res.json({ success: "Successfully Buy" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.find_transaction = async (req, res) => {
  try {
    const transaction = await Transactions.findOne({
      invoice_no: req.query.invoice_no,
    }).populate("purchases.product");

    res.json({
      payload: transaction || {},
      success: "Successfully Find Transaction",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleReturnAction = async (purchase) => {
  try {
    const {
      isPerKilo,
      _id,
      variant1,
      variant2,
      has2Variant,
      hasVariant,
      kiloReturn = 0,
      quantityReturn = 0,
    } = purchase;
    const baseReturn = isPerKilo ? kiloReturn : quantityReturn;
    const baseSaleKey = isPerKilo ? "kilo" : "quantity";
    const baseStockKey = isPerKilo ? "kiloStock" : "quantityStock";
    var query = {
      product: _id,
      ...(!isPerKilo && { quantity: { $gt: 0 } }),
      ...(isPerKilo && { kilo: { $gt: 0 } }),
      ...(hasVariant && { variant1: variant1 }),
      ...(has2Variant && { variant2: variant2 }),
    };

    var isLoopAgain = true;
    while (isLoopAgain) {
      const sale = await Sales.findOne(query).sort({ createdAt: 1 });
      const currentSaleReturn = sale[baseSaleKey];
      var returnPruchase = sale[baseSaleKey] - baseReturn;

      // const stock =await Stocks.finde(sale.stock,{[baseStockKey]:hasEnough?})

      if (hasEnough) {
        isLoopAgain = false;
      }
    }
  } catch (error) {
    console.log("Error Handle return action", error.message);
  }
};

exports.return = async (req, res) => {
  try {
    const {
      returnProductCount = 0,
      returnPurchases = [
        { product: { _id: "" }, quantityReturn: 0, kiloReturn: 0 },
      ],
      invoice_no = "",
    } = req.body;

    for (let index = 0; index < returnPurchases.length; index++) {
      const purchase = returnPurchases[index];
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
