// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// components
import Input from "@/src/components/ui/input";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

interface EpicDeadlineProp {
  onSubmit: SubmitHandler<{
    title: string;
    description: string | null;
    deadline: string | null;
    assignee_id?: string | null | undefined;
  }>;
  isLoading: boolean;
}

const EpicDeadlineInput = ({ onSubmit, isLoading }: EpicDeadlineProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<AddEpicFormData>();

  const { onChange: rhfOnChange } = register("deadline");

  return (
    <>
      <Input
        {...register("deadline")}
        id="deadline"
        type="date"
        onClick={(e) => e.currentTarget.showPicker()}
        onChange={(e) => {
          rhfOnChange(e);
          handleSubmit(onSubmit)();
        }}
        variant={errors.deadline ? "error" : "secondary"}
        disabled={isLoading}
      />
      {errors.deadline && (
        <div className="flex items-center gap-2">
          <ValidationErrorIcon />
          <span className="text-red-600 text-sm">
            {errors.deadline?.message}
          </span>
        </div>
      )}
    </>
  );
};

export default EpicDeadlineInput;
