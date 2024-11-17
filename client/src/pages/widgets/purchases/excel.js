import {
  formattedDate,
  fullName,
  variation,
} from "../../../services/utilities";
import PendingOrders from "../../../services/utilities/downloadExcel/pendingOrders";
import formattedTotal from "../../../services/utilities/forattedTotal";
import productOrder from "../../../services/utilities/product";
import GET from "./GET";

const getQtyKiloText = (key, merchandise) => {
  const {
    kilo = {
      approved: 0,
    },
    kiloGrams = {
      approved: 0,
    },
    quantity = {
      approved: 0,
    },
    product,
  } = merchandise;
  return variation.qtyOrKilo(
    {
      ...merchandise,
      kilo: kilo[key],
      kiloGrams: kiloGrams[key],
      quantity: quantity[key],
    },
    product.isPerKilo
  );
};

const textOfDefecAndDisc = (total, isPerKilo) => {
  return isPerKilo ? productOrder.kiloText(total) : `${total} qty`;
};

const getTotalAmount = (purchase, key = "") => {
  return formattedTotal(GET.totalAmount(purchase?.merchandises, key));
};
const excel = ({
  purchase,
  isReceived,
  isAdmin,
  withRequest = true,
  qtyKiloKey = "Approved",
  title = "Pending",
  withStockman = false,
}) => {
  const { total, expectedDelivered, supplier, merchandises } = purchase;
  const products = merchandises.map((merchandise) => {
    const {
      expiration = "",
      product,
      variant1 = "",
      variant2 = "",
      capital = 0,
      kilo = {
        approved: 0,
      },
      kiloGrams = {
        approved: 0,
      },
      quantity = {
        approved: 0,
      },
    } = merchandise;
    const {
      name,
      hasVariant = false,
      variations = [],
      isPerKilo = false,
    } = product;
    const Received = getQtyKiloText("received", merchandise);
    const Approved = getQtyKiloText("approved", merchandise);
    const Defective = getQtyKiloText("defective", merchandise);
    const basePurchase = isPerKilo ? kilo : quantity;
    const nonDefective = basePurchase.received - basePurchase.defective;
    const discrepancy = basePurchase.approved - basePurchase.received;
    return {
      product: {
        hasVariant,
        name: name,
        variant: variation.getTheVariant(variant1, variant2, variations),
      },

      quantity: {
        ...(!isReceived &&
          withRequest && {
            Request: getQtyKiloText("request", merchandise),
          }),

        [qtyKiloKey]: Approved,
        ...(isReceived && {
          Received,
          Defective,
          "Non-Defective": textOfDefecAndDisc(nonDefective, isPerKilo),
          Discrepancy: textOfDefecAndDisc(discrepancy, isPerKilo),
        }),
      },
      ...(isAdmin && {
        capital: `₱${formattedTotal(capital)}`,
        subtotal: `₱${formattedTotal(
          productOrder.subtotal({
            ...merchandise,
            kilo: kilo?.approved,
            kiloGrams: kiloGrams?.approved,
            quantity: quantity?.approved,
          })
        )}`,
      }),

      ...(isReceived && {
        "Expiration Date": expiration ? formattedDate(expiration) : "--",
      }),
    };
  });
  console.log(products);
  const options = {
    sheet: "PO",
    filename: `${title} Orders`,
    title: `${title} Orders`,
    supplier: supplier.company,
    expected: formattedDate(expectedDelivered),
    total: `₱${formattedTotal(total)}`,
    defective: `₱${getTotalAmount(purchase, "defective")}`,
    discrepancy: `₱${getTotalAmount(purchase, "discrepancy")}`,
    received: `₱${formattedTotal(purchase.totalReceived)}`,
    isAdmin,
    isReceived,
    ...(withStockman && { stockman: fullName(purchase.requestBy.fullName) }),
  };
  PendingOrders({ options, array: products });
};

export default excel;
