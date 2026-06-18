// components
import Input from "@/src/components/ui/input";

// react hook form
import { useFormContext } from "react-hook-form";

// schemas
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

const TaskTitleInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddTaskFormData>();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="title"
        className="flex w-3/5 items-start uppercase label-sm text-slate-2"
      >
        title <span className="text-error">*</span>
      </label>
      <div className="w-full space-y-2">
        <Input
          {...register("title")}
          id="title"
          type="text"
          placeholder="e.g., Finalize structural schematics"
          variant={errors.title ? "error" : "primary"}
        />
        {errors.title && (
          <div className="flex items-center gap-2">
            <ValidationErrorIcon />
            <span className="text-red-600 text-sm">{errors.title.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTitleInput;
