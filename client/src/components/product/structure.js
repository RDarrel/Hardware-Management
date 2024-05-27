const hasVariation2 = {
  _id: "12312312",
  name: "T-shirt",
  hasVariant: true,
  has2Variant: true,
  variants: [
    {
      name: "color",
      options: [
        {
          _id: "123123123",
          name: "red",
          prices: {
            xl: 150,
            lg: 140,
            sm: 130,
          },
        },
        {
          _id: "123123124",
          name: "blue",
          prices: {
            xl: 160,
            lg: 150,
            sm: 140,
          },
        },
      ],
      _id: "123123123123",
    },
    {
      name: "Size",
      options: [
        {
          _id: "123123125",
          name: "xl",
        },
        {
          _id: "123123126",
          name: "lg",
        },
        {
          _id: "123123127",
          name: "sm",
        },
      ],
      _id: "123123123124",
    },
  ],
};

const stock = [
  {
    _id: "stock123",
    product: "12312312", // ID ng produkto
    variant1: "123123123", // ID ng kulay (red)
    variant2: "123123125", // ID ng sukat (xl)
    qty: 20,
  },
  {
    _id: "stock124",
    product: "12312312", // ID ng produkto
    variant1: "123123124", // ID ng kulay (blue)
    variant2: "123123126", // ID ng sukat (lg)
    qty: 15,
  },
  // Dagdag pa ang iba pang stock items dito...
];
