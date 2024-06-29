const Sales = require("../../models/administrator/report/Sales"),
  Stocks = require("../../models/stockman/Stocks"),
  Transactions = require("../../models/administrator/report/Transactions"),
  ReturnRefund = require("../../models/administrator/ReturnRefund"),
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
    const { purchases, invoice_no, cashier, total, customer = "" } = req.body;
    const purchasesWithCapital = await stocks(purchases, String(invoice_no));
    await Sales.insertMany(purchasesWithCapital);
    await Transactions.create({
      cashier,
      invoice_no,
      total,
      purchases,
      customer,
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

const getTotalReturnRefund = (products) => {
  const getTheSubtotal = products.map((obj) => {
    const { product, kilo = 0, kiloGrams = 0, quantity = 0, srp } = obj;
    if (product.isPerKilo) {
      return { ...obj, subtotal: kilo + kiloGrams * srp };
    } else {
      return { ...obj, subtotal: quantity * srp };
    }
  });

  return (
    getTheSubtotal.reduce((acc, curr) => {
      acc += curr.subtotal;
      return acc;
    }, 0) || 0
  );
};

exports.returnProducts = async (req, res) => {
  try {
    const {
      returnBy,
      products: returnProducts,
      invoice_no,
      reason,
      customer,
    } = req.body;

    const transaction = await Transactions.findOne({ invoice_no });

    if (transaction?._id) {
      await Transactions.findByIdAndUpdate(transaction._id, {
        totalReturnSales:
          (transaction?.totalReturnSales || 0) +
          getTotalReturnRefund(returnProducts),
        returnItemCount:
          (transaction?.returnItemCount || 0) + returnProducts.length,
      });
    } else {
      console.log("no have transaction for this invoice_no", invoice_no);
    }

    await stocks(returnProducts, invoice_no);
    await ReturnRefund.create({
      returnBy,
      reason,
      invoice_no,
      status: "return",
      customer,
      products: returnProducts,
    });

    res.json({
      success: "Successfully Return",
      payload: { invoice_no, products: returnProducts },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findAnotherSale = async (query, oldSale) => {
  try {
    return await Stocks.findOne({
      ...query,
      _id: { $ne: oldSale._id },
    }).sort({ createdAt: 1 });
  } catch (error) {
    console.log("Find Another Sale Error", error.message);
  }
};

const deductionForSales = async ({
  product,
  variant1 = "",
  variant2 = "",
  kilo = 0,
  kiloGrams = 0,
  quantity = 0,
  invoice_no,
}) => {
  try {
    const { isPerKilo, has2Variant, hasVariant } = product;
    const baseKey = isPerKilo ? "kilo" : "quantity";
    var baseRefound = isPerKilo ? kilo + kiloGrams : quantity;
    var isLoopAgain = true;
    var query = {
      invoice_no: String(invoice_no),
      product: product._id,
      ...(hasVariant && { variant1: variant1 }),
      ...(has2Variant && { variant2: variant2 }),
    };
    var sale = await Sales.findOne(query).sort({ createdAt: 1 });

    while (isLoopAgain) {
      const saleIsNotEnogh = sale[baseKey] >= baseRefound;
      var remainingRefound = sale[baseKey] - baseRefound;
      if (saleIsNotEnogh && remainingRefound === 0) {
        await Sales.findByIdAndDelete(sale._id);
      } else {
        await Sales.findByIdAndUpdate(sale._id, {
          [baseKey]: remainingRefound,
        });
      }

      if (!saleIsNotEnogh) {
        await Sales.findByIdAndDelete(sale._id);
        var nextSale = await findAnotherSale(query, sale);
        const nextSaleIsEnough =
          nextSale[baseKey] >= Math.abs(remainingRefound);

        const nextRemainingRefound =
          nextSale[baseKey] - Math.abs(remainingRefound);

        await Sales.findByIdAndUpdate(sale._id, {
          [baseKey]: nextRemainingRefound,
        });

        if (!nextSaleIsEnough) {
          baseRefound = Math.abs(nextRemainingRefound);
          sale = await findAnotherSale(query, nextSale);
          isLoopAgain = true;
        } else {
          isLoopAgain = false;
        }
      } else {
        isLoopAgain = false;
      }
    }
  } catch (error) {
    console.log("Error for deduction for sales", error.message);
  }
};

const gramsConverter = (grams) => {
  switch (grams) {
    case 5:
      return 0.5;
    case 75:
      return 0.75;
    case 25:
      return 0.25;
    default:
      return grams;
  }
};

exports.refund = async (req, res) => {
  try {
    const {
      invoice_no,
      products: refundProducts,
      reason,
      refundBy,
      customer,
      newTotal,
      refundAll = false,
    } = req.body;

    const transaction = await Transactions.findOne({ invoice_no });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    var purchases = transaction.purchases || [];

    // This is for the deduction of sales and transactions
    for (const refund of refundProducts) {
      const {
        product,
        variant1,
        variant2,
        kilo = 0,
        kiloGrams = 0,
        quantity,
      } = refund;
      const { isPerKilo, has2Variant, hasVariant } = product;

      const index = purchases.findIndex((item) => {
        if (hasVariant) {
          if (has2Variant) {
            return (
              item.variant1 === variant1 &&
              item.variant2 === variant2 &&
              String(product._id) === String(item.product)
            );
          } else {
            return (
              item.variant1 === variant1 &&
              String(product._id) === String(item.product)
            );
          }
        } else {
          return String(product._id) === String(item.product);
        }
      });

      if (index > -1) {
        const purchase = purchases[index];
        if (isPerKilo) {
          const totalKgInPurchase =
            (purchase?.kilo || 0) + gramsConverter(purchase.kiloGrams || 0);

          const totalKgInRefund = kilo + kiloGrams;
          const totalDeductionRes = totalKgInPurchase - totalKgInRefund;
          var newKilo;
          var newKiloGrams;
          if (totalDeductionRes < 1) {
            newKilo = 0;
            newKiloGrams = totalDeductionRes;
          } else {
            const totalDeducConvertInArray =
              String(totalDeductionRes).split(".");
            console.log(totalDeducConvertInArray);
            newKilo = Number(totalDeducConvertInArray[0] || 0);
            newKiloGrams = Number(totalDeducConvertInArray[1] || 0);
          }

          if (newKilo === 0 && newKiloGrams === 0) {
            purchases.splice(index, 1);
          } else {
            purchases[index] = {
              ...purchase._doc,
              kilo: newKilo || 0,
              kiloGrams: gramsConverter(newKiloGrams),
            };
          }
        } else {
          // This is for quantity refund
          const newQuantity = purchase.quantity - quantity;
          if (newQuantity === 0) {
            purchases.splice(index, 1);
          } else {
            purchases[index] = {
              ...purchase._doc,
              quantity: newQuantity,
            };
          }
        }

        await deductionForSales({
          product,
          variant1,
          variant2,
          kilo,
          kiloGrams,
          quantity,
          invoice_no,
        });
      } else {
        console.log("No purchase record for this product id", product._id);
      }
    }

    await ReturnRefund.create({
      reason,
      invoice_no,
      status: "refund",
      refundBy,
      customer,
      products: refundProducts,
    });

    if (purchases.length === 0 || refundAll) {
      await Transactions.findByIdAndDelete(transaction._id);
    } else {
      await Transactions.findByIdAndUpdate(transaction._id, {
        purchases,
        totalRefundSales:
          (transaction.totalRefundSales || 0) +
          getTotalReturnRefund(refundProducts),
        refundItemCount:
          (transaction.refundItemCount || 0) + refundProducts.length,
        total: newTotal,
      });
    }

    res.json({ success: "Successfully refunded products", payload: {} });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: error.message });
  }
};
