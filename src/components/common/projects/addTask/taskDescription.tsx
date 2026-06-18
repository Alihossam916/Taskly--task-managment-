// react hook form
import { useFormContext } from "react-hook-form";

// components
import Textarea from "@/src/components/ui/textarea";

// schemas
import { AddTaskFormData } from "@/src/lib/schemas/addTaskSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

const TaskDescription = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AddTaskFormData>();

  const description = watch("description");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="w-3/5 uppercase label-sm text-slate-2">
        <span>description</span>
      </label>
      <div className="w-full">
        <Textarea
          {...register("description")}
          id="email"
          placeholder="Provide detailed context for this task..."
          variant={errors.description ? "error" : "primary"}
          className="w-full"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {errors.description && (
            <div className="flex items-center gap-2">
              <ValidationErrorIcon />
              <span className="text-red-600 text-sm">
                {errors.description.message}
              </span>
            </div>
          )}
          <p className="hidden sm:block text-slate-2 ml-auto">
            {description?.length} / 500 characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
