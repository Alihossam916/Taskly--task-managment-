// react hook form
import { SubmitHandler, useFormContext } from "react-hook-form";

// components
import Textarea from "@/src/components/ui/textarea";

// schemas
import { AddEpicFormData } from "@/src/lib/schemas/addEpicSchema";

interface EpicDescriptionProp {
  onSubmit: SubmitHandler<{
    title: string;
    description: string | null;
    deadline: string | null;
    assignee_id?: string | null | undefined;
  }>;
  isLoading: boolean;
}

const EpicDescription = ({ onSubmit, isLoading }: EpicDescriptionProp) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { dirtyFields },
  } = useFormContext<AddEpicFormData>();

  return (
    <>
      <Textarea
        {...register("description")}
        className="body-md leading-relaxed w-full h-fit"
        variant="secondary"
        onBlur={(e) => {
          setValue("description", e.target.value); // sync value first
          if (dirtyFields.description) {
            handleSubmit(onSubmit)();
          }
        }}
        disabled={isLoading}
      />
    </>
  );
};

export default EpicDescription;
