"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// import sign up api
import { signUpApi } from "@/src/lib/api/auth/signUp";

// import schemas
import { signUpSchema, SignUpFormData } from "@/src/lib/schemas/signUpSchema";

// import external libraries
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import ui components
import Button from "../../ui/button";
import Input from "../../ui/input";
import Spinner from "../../ui/spinner";

// import icon components
import { EyeIcon } from "../../icons/eyeIcon";

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) });

  // form submition logic
  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setIsLoading(true);
    try {
      await signUpApi(data);
      toast.success("Account created successfully!");
      reset();
      router.push("/");
    } catch {
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false); // resets the loading state after response
    }
  };

  const passwordValue = watch("password");

  // Validation functions matching signUpSchema
  const passwordValidations = [
    {
      label: "At least 8 characters",
      isValid: passwordValue?.length >= 8,
    },
    {
      label: "One uppercase, lowercase, and digit",
      isValid:
        /[A-Z]/.test(passwordValue || "") &&
        /[a-z]/.test(passwordValue || "") &&
        /[0-9]/.test(passwordValue || ""),
    },
    {
      label: "One special character",
      isValid: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`';]/.test(
        passwordValue || "",
      ),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-6 mt-5"
    >
      {/* name field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="uppercase label-sm">
          <span className="hidden sm:inline">name</span>
          <span className="sm:hidden">full name</span>
        </label>
        <Input
          {...register("name")}
          id="name"
          type="text"
          placeholder="Enter your full name"
          required
          variant={errors.name ? "error" : "primary"}
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>
      {/* email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="uppercase label-sm">
          Email
        </label>
        <Input
          {...register("email")}
          id="email"
          type="text"
          placeholder="yourname@company.com"
          required
          variant={errors.email ? "error" : "primary"}
        />
        {errors.email && (
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        )}
      </div>
      {/* job title field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="job" className="uppercase label-sm">
          Job Title <span className="hidden sm:inline">(Optional)</span>
        </label>
        <Input
          {...register("job")}
          id="job"
          type="text"
          placeholder="e.g. Project Manager"
          variant={errors.job ? "error" : "primary"}
        />
        {errors.job && (
          <span className="text-red-600 text-sm">{errors.job.message}</span>
        )}
      </div>
      {/* password field */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="uppercase label-sm">
            password
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              variant={errors.password ? "error" : "primary"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <EyeIcon />
            </button>
          </div>
        </div>
        {/* confirm password field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="uppercase label-sm">
            confirm password
          </label>
          <Input
            {...register("confirmPassword")}
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            required
            variant={errors.confirmPassword ? "error" : "primary"}
          />
        </div>
      </div>
      {/* ----------- password validation section ----------- */}
      <section className="bg-[#E8EDFF] rounded-md p-4 hidden sm:block">
        {passwordValidations.map((validation, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              {validation.isValid ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z"
                    fill="#004E32"
                  />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z"
                    fill={"#737685"}
                  />
                </svg>
              )}
              <p className={`body-md`}>{validation.label}</p>
            </div>
          );
        })}
      </section>
      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Spinner />}Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
