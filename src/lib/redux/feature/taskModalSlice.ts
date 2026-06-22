import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  taskDetailsOpen: boolean;
  selectedTaskId: string | null;
}

const initialState: ModalState = {
  taskDetailsOpen: false,
  selectedTaskId: null,
};

const taskModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openTaskDetails(state, action: PayloadAction<string>) {
      state.taskDetailsOpen = true;
      state.selectedTaskId = action.payload;
    },
    closeTaskDetails(state) {
      state.taskDetailsOpen = false;
      state.selectedTaskId = null;
    },
  },
});

export const { openTaskDetails, closeTaskDetails } = taskModalSlice.actions;
export default taskModalSlice.reducer;
