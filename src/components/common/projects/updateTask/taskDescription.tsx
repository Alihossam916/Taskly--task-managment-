// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// components
import Textarea from "@/src/components/ui/textarea";

// schemas
import { UpdateTaskFormData } from "@/src/lib/schemas/updateTaskSchema";

interface TaskDescriptionProp {
  onSubmit: SubmitHandler<UpdateTaskFormData>;
  isLoading: boolean;
}

const TaskDescription = ({ onSubmit, isLoading }: TaskDescriptionProp) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { dirtyFields },
  } = useFormContext<UpdateTaskFormData>();

  return (
    <Textarea
      {...register("description")}
      className="body-md leading-relaxed w-full h-fit"
      variant="secondary"
      onBlur={(e) => {
        setValue("description", e.target.value);
        if (dirtyFields.description) {
          handleSubmit(onSubmit)();
        }
      }}
      disabled={isLoading}
    />
  );
};

export default TaskDescription;
