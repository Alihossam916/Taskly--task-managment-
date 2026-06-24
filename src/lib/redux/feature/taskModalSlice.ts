import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  taskDetailsOpen: boolean;
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  taskEpicId: string | null;
}

const initialState: ModalState = {
  taskDetailsOpen: false,
  selectedTaskId: null,
  selectedProjectId: null,
  taskEpicId: null,
};

const taskModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openTaskDetails(
      state,
      action: PayloadAction<{
        taskId: string;
        projectId: string;
        epicId?: string;
      }>,
    ) {
      state.taskDetailsOpen = true;
      state.selectedTaskId = action.payload.taskId;
      state.selectedProjectId = action.payload.projectId;
      state.taskEpicId = action.payload.epicId || null;
    },
    closeTaskDetails(state) {
      state.taskDetailsOpen = false;
      state.selectedTaskId = null;
    },
  },
});

export const { openTaskDetails, closeTaskDetails } = taskModalSlice.actions;
export default taskModalSlice.reducer;
