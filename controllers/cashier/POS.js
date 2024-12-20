const RemoveExpiredProducts = require("../../config/removeExpiredProducts");
const Sales = require("../../models/administrator/report/Sales"),
  Stocks = require("../../models/stockman/Stocks"),
  Transactions = require("../../models/administrator/report/Transactions"),
  Audit = require("../../models/administrator/Audit"),
  ReturnRefund = require("../../models/administrator/ReturnRefund");

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

const handleDiscounts = (purchases = []) => {
  try {
    const _purchases = [...purchases];
    const groupPurchases = _purchases.reduce((acc, curr) => {
      const { product, variant1, variant2 } = curr;
      const { _id = "" } = product;
      const key = `${_id}${variant1 || ""}${variant2 || ""}`;
      const index = acc.findIndex(({ key: _key }) => _key === key);
      if (index > -1) {
        acc[index].sales.push({ ...curr });
      } else {
        acc.push({ key, sales: [{ ...curr }] });
      }
      return acc;
    }, []);

    const applyDiscount = groupPurchases.map(({ sales = [] }) => {
      if (sales.length > 1) {
        const totalGrossSales = reduce((acc, curr) => {
          const { product, srp } = curr;
          const { isPerKilo } = product;
          const baseKey = isPerKilo ? "kilo" : "quantity";
          return (acc += srp * curr[baseKey]);
        }, 0);

        sales.forEach((sale) => {
          const { product, srp = 0, discount = 0 } = sale;
          const { isPerKilo = false } = product;

          if (discount <= 0) return sale;
          const baseKey = isPerKilo ? "kilo" : "quantity";
          const grossSales = srp * sale[baseKey];
          const discountPercentage = grossSales / totalGrossSales;
          return {
            ...sale,
            discount: discount * discountPercentage,
            product: product._id,
          };
        });
      } else {
        return { ...sales[0], product: sales[0]?.product?._id };
      }
    });

    return applyDiscount;
  } catch (error) {
    console.log("Error in discount:", error.message);
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
            ? basePurchase - Math.abs(remainingStock) //kinoconvert ko siya sa positive kapag -2 magiging 2
            : basePurchase
        ).toFixed(2),
        // product: _id,
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
          // product: _id,
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
    await RemoveExpiredProducts();
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
    const {
      purchases,
      invoice_no,
      cashier,
      total,
      totalDue,
      totalDiscount,
      customer = "",
      cash,
    } = req.body;
    const purchasesWithCapital = await stocks(purchases, String(invoice_no));

    if (purchasesWithCapital.length > 0) {
      const purchasesWithDiscount = handleDiscounts(purchasesWithCapital);

      await Sales.insertMany(purchasesWithDiscount);
      await Transactions.create({
        cashier,
        invoice_no,
        total,
        totalDue,
        totalDiscount,
        cash,
        totalWithoutDeduc: total,
        purchases,
        customer,
      });

      await Audit.create({
        invoice_no,
        employee: cashier,
        action: "SALE",
        amount: total,
        description: customer ? `Sale to ${customer}` : "",
      });
    }

    res.json({ success: "Successfully Buy" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.find_transaction = async (req, res) => {
  try {
    const transaction = await Transactions.findOne({
      invoice_no: req.query.invoice_no,
    })
      .populate("purchases.product")
      .populate("cashier");

    const { purchases = [] } = transaction || {};
    const purchasesWithMax = [];
    for (const purchase of purchases) {
      const { product, variant1, variant2 } = purchase;
      const { hasVariant, has2Variant, isPerKilo } = product;
      const query = {
        product: product._id,
        ...(hasVariant && { variant1: variant1 }),
        ...(has2Variant && { variant2: variant2 }),
      };
      const stocks = await Stocks.find(query);
      const max = stocks.reduce(
        (acc, curr) => (acc += curr[isPerKilo ? "kiloStock" : "quantityStock"]),
        0
      );
      purchasesWithMax.push({ ...purchase._doc, max });
    }

    res.json({
      payload: { ...transaction._doc, purchases: purchasesWithMax } || {},
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
      return { ...obj, subtotal: (kilo + kiloGrams) * srp };
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
      const purchases = [...transaction.purchases];
      const returnProduct = { ...returnProducts[0] };
      const {
        product,
        variant1 = "",
        variant2 = "",

        kilo = 0,
        kiloGrams = 0,
        quantity = 0,
      } = returnProduct;
      const indexOfReturnProduct = purchases.findIndex((purchase) => {
        if (product.hasVariant) {
          if (product.has2Variant) {
            return (
              String(purchase.product) === product._id &&
              purchase.variant1 === variant1 &&
              purchase.variant2 === variant2
            );
          } else {
            return (
              String(purchase.product) === product._id &&
              purchase.variant1 === variant1
            );
          }
        } else {
          return String(purchase.product) === product._id;
        }
      });

      const existingPurchase = { ...purchases[indexOfReturnProduct]._doc };
      var { quantityReturn = 0, kiloReturn = 0 } = existingPurchase;
      const totalKiloReturn = kilo + kiloGrams;
      purchases[indexOfReturnProduct] = {
        ...existingPurchase,
        ...(product.isPerKilo
          ? { kiloReturn: (kiloReturn += totalKiloReturn) }
          : { quantityReturn: (quantityReturn += quantity) }),
      };

      const totalReplacement = getTotalReturnRefund(returnProducts);

      await Transactions.findByIdAndUpdate(transaction._id, {
        purchases: purchases,
        totalReturnSales:
          (transaction?.totalReturnSales || 0) + totalReplacement,
        returnItemCount: (transaction?.returnItemCount || 0) + 1,
      });

      await Audit.create({
        invoice_no,
        employee: returnBy,
        action: "REPLACEMENT",
        amount: totalReplacement,
        description: `Processed a replacement for products sold to ${
          customer || "a customer"
        }.`,
      });
    } else {
      console.log("no have transaction for this invoice_no", invoice_no);
    }
    await stocks(returnProducts, invoice_no);
    await ReturnRefund.create({
      cashier: returnBy,
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
      //3-4 = -1 remaingRefund
      const saleIsNotEnogh = sale[baseKey] >= baseRefound;
      var remainingRefound = sale[baseKey] - baseRefound;
      // if (saleIsNotEnogh && remainingRefound === 0) {
      //   await Sales.findByIdAndDelete(sale._id);
      // } else { comment muna dahil sa refund
      const refundQuantity = saleIsNotEnogh ? baseRefound : sale[baseKey];
      await Sales.findByIdAndUpdate(sale._id, {
        [baseKey]: remainingRefound,
        refundQuantity,
      });
      // }

      if (!saleIsNotEnogh) {
        await Sales.findByIdAndDelete(sale._id);
        //2  - 1
        var nextSale = await findAnotherSale(query, sale);
        const nextSaleIsEnough =
          nextSale[baseKey] >= Math.abs(remainingRefound);
        //refund 4 si sale 3

        const nextRemainingRefound =
          nextSale[baseKey] - Math.abs(remainingRefound);

        const refundQuantity = nextSaleIsEnough
          ? Math.abs(remainingRefound)
          : nextSale[baseKey];

        await Sales.findByIdAndUpdate(sale._id, {
          [baseKey]: nextRemainingRefound,
          refundAmount: nextSale.srp * refund,
          refundQuantity,
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

const handleKiloGramsRefund = (currentRefund, newRefund) => {
  const totalCurrentKgRefund =
    (currentRefund.kiloRefund || 0) + (currentRefund.kiloGramsRefund || 0);

  const totalNewKgRefund = newRefund.kilo + newRefund.kiloGrams;

  const total = totalCurrentKgRefund + totalNewKgRefund;

  const totalNewRefund = String(totalCurrentKgRefund + totalNewKgRefund).split(
    "."
  );

  var newRefundKilo = 0;
  var newRefundGrams = 0;
  if (total >= 1) {
    newRefundKilo = Number(totalNewRefund[0] || 0);
    newRefundGrams = gramsConverter(Number(totalNewRefund[1] || 0));
  } else {
    newRefundGrams = gramsConverter(Number(totalNewRefund[1] || 0));
  }

  return { kiloRefund: newRefundKilo, kiloGramsRefund: newRefundGrams };
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
            newKilo = Number(totalDeducConvertInArray[0] || 0);
            newKiloGrams = Number(totalDeducConvertInArray[1] || 0);
          }

          if (newKilo === 0 && newKiloGrams === 0) {
            purchases[index] = {
              ...purchase._doc,
              isRefundAll: true,
              kilo: 0,
              kiloGrams: 0,
              ...handleKiloGramsRefund(purchase, { kilo, kiloGrams }),
            };
          } else {
            purchases[index] = {
              ...purchase._doc,
              kilo: newKilo || 0,
              kiloGrams: gramsConverter(newKiloGrams),
              ...handleKiloGramsRefund(purchase, { kilo, kiloGrams }),
            };
          }
        } else {
          // This is for quantity refund
          const newQuantity = purchase.quantity - quantity;
          if (newQuantity === 0) {
            // purchases.splice(index, 1);
            purchases[index] = {
              ...purchase._doc,
              isRefundAll: true,
              quantity: 0,
              quantityRefund: (purchase.quantityRefund || 0) + (quantity || 0),
            };
          } else {
            purchases[index] = {
              ...purchase._doc,
              quantity: newQuantity,
              quantityRefund: (purchase.quantityRefund || 0) + quantity,
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
      cashier: refundBy,
      customer,
      products: refundProducts,
    });

    const totalRefund = getTotalReturnRefund(refundProducts);
    if (purchases.length === 0 || refundAll) {
      // await Transactions.findByIdAndDelete(transaction._id);
      await Transactions.findByIdAndUpdate(transaction._id, {
        isExist: false,
        total: 0,
        refundItemCount: (transaction.refundItemCount || 0) + 1,
        totalRefundSales: (transaction.totalRefundSales || 0) + totalRefund,
      });
    } else {
      const total = Number(newTotal || 0);
      await Transactions.findByIdAndUpdate(transaction._id, {
        purchases,
        totalRefundSales: (transaction.totalRefundSales || 0) + totalRefund,
        refundItemCount: (transaction.refundItemCount || 0) + 1,
        total,
      });
    }

    await Audit.create({
      invoice_no,
      employee: returnBy,
      action: "REFUND",
      amount: totalRefund,
      description: `Processed a refund for products sold to ${
        customer || "a customer"
      }.`,
    });
    res.json({ success: "Successfully refunded products", payload: {} });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: error.message });
  }
};
