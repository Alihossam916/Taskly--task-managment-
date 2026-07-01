// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// components
import Input from "@/src/components/ui/input";

// schemas
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

interface TaskDeadlineProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
}

const TaskDueDateInput = ({ onSubmit, isLoading }: TaskDeadlineProp) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<UpdateTaskFormData>();

  return (
    <>
      <Input
        {...register("due_date")}
        id="due_date"
        type="date"
        onClick={(e) => e.currentTarget.showPicker()}
        onChange={(e) => {
          setValue("due_date", e.target.value);
          handleSubmit(onSubmit)();
        }}
        variant={errors.due_date ? "error" : "secondary"}
        disabled={isLoading}
      />
      {errors.due_date && (
        <div className="flex items-center gap-2">
          <ValidationErrorIcon />
          <span className="text-red-600 text-sm">
            {errors.due_date?.message}
          </span>
        </div>
      )}
    </>
  );
};
export default TaskDueDateInput;
