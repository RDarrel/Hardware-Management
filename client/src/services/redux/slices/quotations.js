import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axioKit, bulkPayload, socket } from "../../utilities";

const name = "quotations";

const initialState = {
  collections: [],
  quotations: [],
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

export const QUOTATIONS = createAsyncThunk(
  `${name}/QUOTATIONS`,
  ({ token }, thunkAPI) => {
    try {
      return axioKit.universal(`${name}/quotations`, token);
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

export const STATUS = createAsyncThunk(`${name}/status`, (form, thunkAPI) => {
  try {
    return axioKit.update(name, form.data, form.token, "status");
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

export const DESTROY_QOUTATION = createAsyncThunk(
  `${name}/destroy_quotation`,
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
    RESET: (state, data) => {
      state.isSuccess = false;
      state.message = "";
    },

    UPDATE_COLLETIONS: (state, data) => {
      state.collections.unshift(data.payload);
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

      .addCase(QUOTATIONS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(QUOTATIONS.fulfilled, (state, action) => {
        const { payload } = action.payload;
        state.quotations = payload;
        state.isLoading = false;
      })
      .addCase(QUOTATIONS.rejected, (state, action) => {
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

      .addCase(STATUS.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(STATUS.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        bulkPayload(state, payload);
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(STATUS.rejected, (state, action) => {
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

        socket.emit("send_quotation", payload);

        state.message = success;
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
          ({ _id }) => _id === payload?._id
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
      })

      .addCase(DESTROY_QOUTATION.fulfilled, (state, action) => {
        const { success, payload } = action.payload;
        const index = state.quotations.findIndex(
          ({ _id }) => _id === payload?._id
        );
        state.quotations.splice(index, 1);
        state.showModal = false;
        state.message = success;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(DESTROY_QOUTATION.rejected, (state, action) => {
        const { error } = action;
        state.showModal = false;
        state.message = error.message;
        state.isLoading = false;
      });
  },
});

export const { RESET, CUSTOMALERT, UPDATE_COLLETIONS } = reduxSlice.actions;

export default reduxSlice.reducer;
