import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, bulkPayload } from "../../../../utilities";

const name = "administrator/products";

const initialState = {
  collections: [],
  progress: 0,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const BROWSE = createAsyncThunk(
  `${name}`,
  ({ token, key }, thunkAPI) => {
    try {
      return axioKit.universal(name, token, key);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const SELLING_PRODUCTS = createAsyncThunk(
  `${name}/SELLING_PRODUCTS`,
  ({ token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/sellingProducts`, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const FIND = createAsyncThunk(`${name}/find`, (form, thunkAPI) => {
  try {
    return axioKit.universal(`${name}/find`, form.token, form.key);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const SAVE = createAsyncThunk(`${name}/save`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const UPDATE = createAsyncThunk(`${name}/update`, (form, thunkAPI) => {
  try {
    return axioKit.update(name, form.data, form.token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const VARIATION_UPDATE = createAsyncThunk(
  `${name}/variation`,
  (form, thunkAPI) => {
    try {
      return axioKit.update(name, form.data, form.token, "variation");
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const DESTROY = createAsyncThunk(
  `${name}/destroy`,
  ({ token, data }, thunkAPI) => {
    try {
      return axioKit.destroy(name, data, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const handleRemoveNoStocks = (products) => {
  const _products = [...JSON.parse(JSON.stringify(products))];
  for (const product of _products) {
    const productIndex = _products.findIndex(({ _id }) => _id === product._id);
    const { hasVariant, has2Variant } = product;
    if (hasVariant) {
      const options = [...product.variations[0]?.options] || [];
      const optionsHaveStocks = options.filter((item) => item.max !== 0);

      if (optionsHaveStocks.length > 0) {
        _products[productIndex].variations[0] = {
          ..._products[productIndex].variations[0],
          options: optionsHaveStocks,
        };
      } else {
        _products.splice(productIndex, 1);
      }

      if (has2Variant) {
        const allPricesHaveNoStocks = options.every((option) =>
          option.prices.every((price) => price?.max === 0 || !price.max)
        );

        if (!allPricesHaveNoStocks) {
          // kapag meron pang stocks yung bawat prices ng options
          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const { prices = [] } = option;
            const pricesHaveStocks = prices.filter(({ max }) => max && max > 0);
            if (pricesHaveStocks.length > 0) {
              const newPrices = prices.map((price) =>
                price.max > 0
                  ? { ...price, disable: false }
                  : { ...price, disable: true }
              );
              options[i] = { ...options[i], prices: newPrices };
            } else {
              options.splice(i, 1);
            }
          }

          //para kapag iisa nalang yung option mapalitan na yung option sa vr2
          if (options.length === 1) {
            const vr1 = _products[productIndex].variations[1];
            _products[productIndex].variations[1] = {
              ...vr1,
              options: options[0].prices.filter(
                ({ disable }) => disable === false
              ),
            };
          }

          _products[productIndex].variations[0] = {
            ..._products[productIndex].variations[0],
            options,
          };
        } else {
          //kapag wala ng stocks yung bawat prices ng option ireremove na yung product na yun
          _products.splice(productIndex, 1);
        }
      }
    } else {
      if (product.max === 0) {
        _products.splice(productIndex, 1);
      }
    }
  }

  return _products;
};

export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    CUSTOMALERT: (state, data) => {
      state.message = data.payload;
    },
    RESET: (state, data) => {
      state.isSuccess = false;
      state.message = "";
    },

    UPDATE_MAX: (state, data) => {
      const _collections = [...state.collections];
      const order = data.payload;
      const { purchases = [] } = order;
      for (const purchase of purchases) {
        const {
          product,
          quantity,
          kilo = 0,
          kiloGrams = 0,
          variant1,
          variant2,
        } = purchase;
        const { hasVariant, has2Variant, isPerKilo } = product;

        const index = _collections.findIndex(({ _id }) => product._id === _id);
        const _product = _collections[index];

        if (hasVariant) {
          const options = [..._product.variations[0].options];
          const indexOption = options.findIndex(({ _id }) => _id === variant1);
          if (isPerKilo) {
            options[indexOption].max -= kilo + kiloGrams;
          } else {
            options[indexOption].max -= quantity;
          }

          if (has2Variant) {
            const prices = [...options[indexOption]?.prices];
            const indexPrice = prices.findIndex(({ _id }) => _id === variant2);
            if (isPerKilo) {
              prices[indexPrice].max -= kilo + kiloGrams;
            } else {
              prices[indexPrice].max -= quantity;
            }
            options[indexOption] = { ...options[indexOption], prices };
          }

          _product.variations[0] = { ..._product.variations[0], options };
        } else {
          if (isPerKilo) {
            _product.max -= kilo + kiloGrams;
          } else {
            _product.max -= quantity;
          }
        }
        const oldSold = _product.sold || 0;
        _collections[index] = {
          ..._product,
          sold: isPerKilo ? oldSold + (kilo + kiloGrams) : oldSold + quantity,
        };
      }

      state.collections = handleRemoveNoStocks(_collections) || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BROWSE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BROWSE.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(BROWSE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SELLING_PRODUCTS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SELLING_PRODUCTS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(SELLING_PRODUCTS.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(FIND.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(FIND.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.collections = payload;
        state.isLoading = false;
      })
      .addCase(FIND.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        bulkPayload(state, payload);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(VARIATION_UPDATE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(VARIATION_UPDATE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        bulkPayload(state, payload);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(VARIATION_UPDATE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(SAVE.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SAVE.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        state.message = success;
        state.collections.unshift(payload);
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })
      .addCase(DESTROY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.collections.findIndex(
          ({ _id }) => _id === payload._id
        );
        state.collections.splice(index, 1);
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY.rejected, (state, action) => {
        const { error } = action;
        state.showModal = false;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, CUSTOMALERT, UPDATE_MAX } = reduxSlice.actions;

export default reduxSlice.reducer;
