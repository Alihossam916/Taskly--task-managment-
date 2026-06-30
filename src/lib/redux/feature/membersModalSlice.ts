import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  membersModalOpen: boolean;
}

const initialState: ModalState = {
  membersModalOpen: false,
};

const membersModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openMembersModal(state) {
      state.membersModalOpen = true;
    },
    closeMembersModal(state) {
      state.membersModalOpen = false;
    },
  },
});

export const { openMembersModal, closeMembersModal } =
  membersModalSlice.actions;
export default membersModalSlice.reducer;
