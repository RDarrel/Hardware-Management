const Sales = require("../../models/administrator/report/Sales"),
  Stocks = require("../../models/stockman/Stocks"),
  Transactions = require("../../models/administrator/report/Transactions"),
  Cart = require("../../models/Cart"),
  handleDuplicate = require("../../config/duplicate");

const stocksPerKilo = async (
  stock,
  purchase,
  purchasesWithCapital,
  invoice_no
) => {
  try {
    const {
      kilo: kiloPurchase,
      kiloGrams: gramsPurchase,
      product,
      variant1,
      variant2,
    } = purchase;
    const { has2Variant, hasVariant, _id } = product;

    const totalPurchase = kiloPurchase + gramsPurchase;
    const stockIsEnough = stock.kiloStock >= totalPurchase;

    const query = {
      product: _id,
      kilo: { $gte: 1 },
      ...(hasVariant && { variant1 }),
      ...(has2Variant && { variant2 }),
    };

    const remainingStock = stock.kiloStock - totalPurchase;
    //yung remaining stock na ito kapag nag negative ang result yun yung gagamitin kong pang bawas sa next new Stock
    purchasesWithCapital.push({
      ...purchase,
      capital: stock.capital,
      kilo: Number(
        !stockIsEnough
          ? totalPurchase - Math.abs(remainingStock) //cinoconvert ko siya sa positive kapag -2 magiging 2
          : totalPurchase
      ).toFixed(2),
      product: _id,
      invoice_no,
    });

    await Stocks.findByIdAndUpdate(
      stock._id,
      {
        kiloStock: !stockIsEnough
          ? 0
          : Number(remainingStock - 0.001).toFixed(2),
      },
      { new: true }
    );

    if (!stockIsEnough) {
      const newStock = await Stocks.findOne(query).sort({ createdAt: 1 });
      if (!newStock) {
        newStock = await Stocks.findOne(query).sort({ createdAt: -1 });
      }
      const remainingPurchaseKilo = Math.abs(remainingStock);
      const remainingNewStock = newStock.kiloStock - remainingPurchaseKilo;

      purchasesWithCapital.push({
        ...purchase,
        capital: newStock.capital,
        kilo: Number(remainingPurchaseKilo).toFixed(2),
        product: _id,
        invoice_no,
      });

      await Stocks.findByIdAndUpdate(
        newStock._id,
        { kiloStock: Number(remainingNewStock - 0.001).toFixed(2) },
        { new: true }
      );
    }
  } catch (error) {
    console.log(`Stock Perkilo:${error.message}`);
  }
};

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

const stocksPerQuantity = async (
  stock,
  purchase,
  purchasesWithCapital,
  invoice_no
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
  const basePurchase = isPerKilo ? kilo + kiloGrams : purchaseQty;
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
      purchasesWithCapital.push({
        ...purchase,
        capital: stock.capital,
        [basePurchaseKey]: Number(
          !stockIsEnough && !have1Stock && !hasLastStock
            ? basePurchase - Math.abs(remainingStock) //cinoconvert ko siya sa positive kapag -2 magiging 2
            : basePurchase
        ).toFixed(2),
        product: _id,
        invoice_no,
      });

      await Stocks.findByIdAndUpdate(
        stock._id,
        {
          [baseStockKey]:
            !stockIsEnough && !hasLastStock && !have1Stock ? 0 : remainingStock,
        },
        { new: true }
      );

      if (!stockIsEnough && !hasLastStock && !have1Stock) {
        nextStock = await Stocks.findOne({
          ...query,
          _id: { $ne: stock._id },
        }).sort({ createdAt: 1 });

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
        // console.log(baseRemainingStock);
        await Stocks.findByIdAndUpdate(
          nextStock._id,
          {
            [baseStockKey]:
              nextStockRemainingQty < 0 && !hasNoMoreStock
                ? 0
                : nextStockRemainingQty,
          },
          { new: true }
        );

        if (nextStockRemainingQty < 0 && !hasNoMoreStock) {
          basePurchase = Math.abs(nextStockRemainingQty);

          stock = await Stocks.findOne({
            ...query,
            _id: { $ne: nextStock._id },
          }).sort({ createdAt: 1 });

          if (await checkerOfLastStock(product._id, stock)) {
            hasLastStock = true;
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

      const query = {
        product: _id,
        ...(!isPerKilo && { quantity: { $gte: 1 } }),
        ...(isPerKilo && { kilo: { $gte: 1 } }),
        ...(hasVariant && { variant1: variant1 }),
        ...(has2Variant && { variant2: variant2 }),
      };

      const stock = await Stocks.findOne(query).sort({ createdAt: 1 });
      if (!stock) {
        //para kapag wala siyang mahanap na meron pang stock mag nenegative siya sa pinaka unang nabili na stock
        stock = await Stocks.findOne(query).sort({ createdAt: -1 });
      }

      if (isPerKilo) {
        await stocksPerKilo(stock, purchase, purchasesWithCapital, invoice_no);
      } else {
        await stocksPerQuantity(
          stock,
          purchase,
          purchasesWithCapital,
          invoice_no
        );
      }
    }

    return purchasesWithCapital;
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};

exports.pos = async (req, res) => {
  try {
    const { purchases, invoice_no, cashier, total } = req.body;
    // const cartIdsToDelete = purchases.map(({ _id }) => _id).filter(Boolean);

    const purchasesWithCapital = await stocks(purchases, invoice_no);

    await Sales.insertMany(purchasesWithCapital);
    // await Transactions.create({
    //   cashier,
    //   invoice_no,
    //   total,
    //   purchases,
    // });

    // await Cart.deleteMany({ _id: { $in: cartIdsToDelete } });

    res.json({ success: "Successfully Buy" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
