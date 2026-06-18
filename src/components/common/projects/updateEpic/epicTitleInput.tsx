// components
import Input from "@/src/components/ui/input";

// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";

// icons
import ValidationErrorIcon from "@/src/components/icons/validationErrorIcon";

interface EpicTitleProp {
  onSubmit: SubmitHandler<{
    title: string;
    description: string | null;
    deadline: string | null;
    assignee_id?: string | null | undefined;
  }>;
  isLoading: boolean;
}

const EpicTitleInput = ({ onSubmit, isLoading }: EpicTitleProp) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useFormContext<AddEpicFormData>();
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

export default EpicTitleInput;
