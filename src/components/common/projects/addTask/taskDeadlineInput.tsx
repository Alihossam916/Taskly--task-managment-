// react hook form
import { useFormContext } from "react-hook-form";

// components
import Input from "@/src/components/ui/input";

// schemas
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

const TaskDeadlineInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddTaskFormData>();

  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="deadline"
        className="flex w-3/5 items-start uppercase label-sm text-slate-2"
      >
        due date
      </label>
      <div className="w-full space-y-2">
        <Input
          {...register("due_date")}
          id="deadline"
          type="date"
          placeholder="Enter project title"
          onClick={(e) => e.currentTarget.showPicker()}
          variant={errors.due_date ? "error" : "primary"}
        />
        {errors.due_date && (
          <div className="flex items-center gap-2">
            <ValidationErrorIcon />
            <span className="text-red-600 text-sm">
              {errors.due_date.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDeadlineInput;
