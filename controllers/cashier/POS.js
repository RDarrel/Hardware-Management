const Sales = require("../../models/administrator/report/Sales"),
  Stocks = require("../../models/stockman/Stocks"),
  Transactions = require("../../models/administrator/report/Transactions");

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
    const stockIsEnough = stock.kilo >= totalPurchase;

    const query = {
      product: _id,
      kilo: { $ne: 0 },
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
      { kilo: !stockIsEnough ? 0 : Number(remainingStock - 0.005).toFixed(2) },
      { new: true }
    );

    if (!stockIsEnough) {
      const newStock = await Stocks.findOne(query).sort({ createdAt: 1 });
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
        { kilo: Number(remainingNewStock - 0.005).toFixed(2) },
        { new: true }
      );
    }
  } catch (error) {
    console.log(`Stock Perkilo:${error.message}`);
  }
};

const stocksPerQuantity = async (
  stock,
  purchase,
  purchasesWithCapital,
  invoice_no
) => {
  const { quantity: purchaseQty, product } = purchase;
  const { has2Variant, hasVariant, _id } = product;
  const stockIsEnough = stock.quantity >= purchaseQty;
  const query = {
    product: _id,
    quantity: { $ne: 0 },
    ...(hasVariant && { variant1: variant1 }),
    ...(has2Variant && { variant2: variant2 }),
  };
  try {
    const remainingStock = stock.quantityStock - purchaseQty;
    //yung remaining stock na ito kapag nag negative ang result yun yung gagamitin kong pang bawas sa next new Stock
    purchasesWithCapital.push({
      ...purchase,
      capital: stock.capital,
      quantity: !stockIsEnough
        ? purchaseQty - Math.abs(remainingStock) //cinoconvert ko siya sa positive kapag -2 magiging 2
        : purchaseQty,
      product: _id,
      invoice_no,
    });

    await Stocks.findByIdAndUpdate(
      stock._id,
      { quantity: !stockIsEnough ? 0 : remainingStock },
      { new: true }
    );

    if (!stockIsEnough) {
      const remaingPurchaseQty = Math.abs(remainingStock); // kaya ko siya sinalin jan kasi yung result na naging negative yun yung quantity na hindi pa na sasave sa sales

      const newStock = await Stocks.findOne(query).sort({ createdAt: 1 });
      const remainingNewStock = newStock.quantityStock - remaingPurchaseQty;
      purchasesWithCapital.push({
        ...purchase,
        capital: newStock.capital,
        quantity: remaingPurchaseQty,
        product: _id,
        invoice_no,
      });

      await Stocks.findByIdAndUpdate(
        newStock._id,
        { quantity: remainingNewStock },
        { new: true }
      );
    }
  } catch (error) {
    console.log(`Error Per Quantity:${error.message}`);
  }
};

const stocks = async (purchases, invoice_no) => {
  try {
    const purchasesWithCapital = [];
    for (const purchase of purchases) {
      const { variant1, variant2, product } = purchase;
      const { _id, isPerKilo, has2Variant, hasVariant } = product;
      const query = {
        product: _id,
        ...(!isPerKilo && { quantity: { $ne: 0 } }),
        ...(isPerKilo && { kilo: { $ne: 0 } }),
        ...(hasVariant && { variant1 }),
        ...(has2Variant && { variant2 }),
      };

      const stock = await Stocks.findOne(query).sort({ createdAt: 1 });
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

exports.save = async (req, res) => {
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

    res.json({ success: "Successfully Buy", payload: {} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
