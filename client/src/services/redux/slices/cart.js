import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, bulkPayload, socket } from "../../utilities";

const name = "cart";

const initialState = {
  collections: [],
  checkOutProducts: [],
  suppliers: [],
  progress: 0,
  isSuccess: false,
  isLoading: false,
  isLimit: false,
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

export const SUPPLIERS = createAsyncThunk(
  `SUPPLIERS`,
  ({ token }, thunkAPI) => {
    try {
      return axioKit.universal("cart/suppliers", token);
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

export const PRE_ORDER = createAsyncThunk(
  `${name}/pre_order`,
  (form, thunkAPI) => {
    try {
      return axioKit.save(`${name}`, form.data, form.token, "pre_order");
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

export const GENERATE_RECEIPT = createAsyncThunk(
  `${name}/GENERATE_RECEIPT`,
  (form, thunkAPI) => {
    try {
      return axioKit.save("mailer", form.data, form.token, "generateReceipt");
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

export const POS = createAsyncThunk(`${name}/pos`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token, "pos");
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const BUY = createAsyncThunk(`${name}/BUY`, (form, thunkAPI) => {
  try {
    return axioKit.save(name, form.data, form.token, "buy");
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

export const changeVariant = createAsyncThunk(
  `${name}/changeVariant`,
  (form, thunkAPI) => {
    try {
      return axioKit.update(name, form.data, form.token, "changeVariant");
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

export const reduxSlice = createSlice({
  name,
  initialState,
  reducers: {
    CUSTOMALERT: (state, data) => {
      state.message = data.payload;
    },

    CHECKOUT: (state, data) => {
      state.checkOutProducts = data.payload;
    },

    RESET: (state, data) => {
      state.isSuccess = false;
      state.message = "";
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

      .addCase(SUPPLIERS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(SUPPLIERS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.suppliers = payload;
        state.isLoading = false;
      })
      .addCase(SUPPLIERS.rejected, (state, action) => {
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

      .addCase(changeVariant.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(changeVariant.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        bulkPayload(state, payload);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(changeVariant.rejected, (state, action) => {
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
        const _collections = [...state.collections];
        const index = _collections.findIndex(({ _id }) => payload._id === _id);
        if (index > -1) {
          _collections[index] = payload;
        } else {
          _collections.unshift(payload);
        }
        state.message = success;
        state.collections = _collections;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(SAVE.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(BUY.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(BUY.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const { deletedIDS, notifications, purchases } = payload;
        state.collections = state.collections.filter(
          (collection) => !deletedIDS.includes(collection._id)
        );

        socket.emit("send_purchases", purchases);
        socket.emit("send_notification", notifications);

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(BUY.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(GENERATE_RECEIPT.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(GENERATE_RECEIPT.fulfilled, (state, action) => {
        const { success, payload } = action.payload;

        const _collections = [...state.collections];
        const newCollectionns = _collections.filter(
          (collection) => !payload.some(({ _id }) => collection._id === _id)
        );
        state.collections = newCollectionns;

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(GENERATE_RECEIPT.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(PRE_ORDER.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })

      .addCase(PRE_ORDER.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const { isLimit = false, orders = [], order } = payload;

        if (!isLimit) {
          const _collections = [...state.collections];
          const newCollectionns = _collections.filter(
            (collection) => !orders.includes(collection._id)
          );
          socket.emit("send_quotation", order);

          state.collections = newCollectionns;
        }

        state.isLimit = isLimit;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(PRE_ORDER.rejected, (state, action) => {
        const { error } = action;
        state.message = error.message;
        state.isLoading = false;
      })

      .addCase(POS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(POS.fulfilled, (state, action) => {
        const { success } = action.payload;

        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(POS.rejected, (state, action) => {
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

export const { RESET, CUSTOMALERT, CHECKOUT } = reduxSlice.actions;

export default reduxSlice.reducer;
