"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeTaskDetails } from "@/src/lib/redux/feature/taskModalSlice";

const TaskDetailsModal = () => {
  const { taskDetailsOpen, selectedTaskId } = useSelector(
    (state: any) => state.taskModal,
  );
  const dispatch = useDispatch();

  if (!taskDetailsOpen || !selectedTaskId) return null;

  return (
    <div
      onClick={() => {
        dispatch(closeTaskDetails());
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div onClick={(e) => e.stopPropagation()}>{selectedTaskId}</div>
    </div>
  );
};

export default TaskDetailsModal;
