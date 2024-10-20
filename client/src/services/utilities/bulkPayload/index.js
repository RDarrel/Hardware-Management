const bulkPayload = (state, payload, isUpdate = true) => {
  if (Array.isArray(payload)) {
    for (const index in payload) {
      const item = { ...payload[index] };
      const iIndex = state.collections.findIndex((e) => e._id === item._id);
      if (isUpdate) {
        state.collections[iIndex] = item;
      } else {
        state.collections.splice(iIndex, 1);
      }
    }
  } else {
    const index = state.collections.findIndex(
      (item) => item?._id === payload?._id
    );
    if (index <= -1) return false;

    if (isUpdate) {
      state.collections[index] = payload;
    } else {
      state.collections.splice(index, 1);
    }
  }
};

export default bulkPayload;
