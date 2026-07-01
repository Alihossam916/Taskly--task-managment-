// components
import Input from "@/src/components/ui/input";

// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// schemas
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

interface TaskTitleProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
}

const TaskTitleInput = ({ onSubmit, isLoading }: TaskTitleProp) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useFormContext<UpdateTaskFormData>();
  return (
    <>
      <Input
        {...register("title")}
        className="headline-lg text-2xl capitalize truncate w-full"
        variant="secondary"
        onBlur={(e) => {
          setValue("title", e.target.value); // sync value first
          if (dirtyFields.title) {
            handleSubmit(onSubmit)();
          }
        }}
        disabled={isLoading}
      />
      {errors.title && (
        <div className="flex items-center gap-2">
          <ValidationErrorIcon />
          <span className="text-red-600 text-sm">{errors.title.message}</span>
        </div>
      )}
    </>
  );
};

export default TaskTitleInput;
