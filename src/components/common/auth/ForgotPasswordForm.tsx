"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import {
  forgotPasswordSchema,
  ForgotPasswordData,
} from "@/src/lib/schemas/forgotPasswordSchema";
import { forgotPasswordApi } from "@/src/lib/api/auth/forgotPassword";

// form handlers
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ui components
import Button from "../../ui/button";
import Input from "../../ui/input";
import Spinner from "../../ui/spinner";

// icons
import CircleCheck from "@/src/components/icons/circleCheck";
import Timer from "@/src/components/icons/timer";
import LeftArrow from "@/src/components/icons/leftArrow";

const ForgotPasswordFrom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(300); // countdown for resend button
  const [canResend, setCanResend] = useState(false); // change resend button from disabled to active
  const [resendAttempts, setResendAttempts] = useState(0); // resend button trials
  const MAX_RESEND_ATTEMPTS = 3;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  // perform a countdown for the resend button
  useEffect(() => {
    if (!submitted || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true); // enable resend button after the countdown finishes
          return 0;
        }
        return prev - 1; // decrement countdown by 1 second
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, countdown]);

  // form submition logic
  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    setIsLoading(true);
    const response = await forgotPasswordApi({
      email: data.email,
    });
    setSubmitted(true);
    setCountdown(300); // reset countdown
    setCanResend(false); // disable resend until timer finishes
    if (submitted) {
      setResendAttempts((prev) => prev + 1); // only count after first submit
    }
    setIsLoading(false);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="gap-2 px-6 py-12 sm:mt-12 mb-12 rounded-sm max-w-xl mx-auto sm:shadow-lg sm:bg-white">
      <div className="w-full flex flex-col items-center bg-white sm:bg-transparent py-12 px-8 shadow-lg sm:shadow-none">
        <i className="mb-4 bg-primary-container/20 p-4 rounded-xl sm:hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10H2C2 11.1 2.20833 12.1375 2.625 13.1125C3.04167 14.0875 3.6125 14.9375 4.3375 15.6625C5.0625 16.3875 5.9125 16.9625 6.8875 17.3875C7.8625 17.8125 8.9 18.025 10 18.025C12.2333 18.025 14.125 17.25 15.675 15.7C17.225 14.15 18 12.2583 18 10.025C18 7.79167 17.225 5.9 15.675 4.35C14.125 2.8 12.2333 2.025 10 2.025C8.51667 2.025 7.17083 2.3875 5.9625 3.1125C4.75417 3.8375 3.8 4.8 3.1 6H6V8H0V2H2V4C2.91667 2.78333 4.06667 1.8125 5.45 1.0875C6.83333 0.3625 8.35 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM8 14C7.71667 14 7.47917 13.9042 7.2875 13.7125C7.09583 13.5208 7 13.2833 7 13V10C7 9.71667 7.09583 9.47917 7.2875 9.2875C7.47917 9.09583 7.71667 9 8 9V8C8 7.45 8.19583 6.97917 8.5875 6.5875C8.97917 6.19583 9.45 6 10 6C10.55 6 11.0208 6.19583 11.4125 6.5875C11.8042 6.97917 12 7.45 12 8V9C12.2833 9 12.5208 9.09583 12.7125 9.2875C12.9042 9.47917 13 9.71667 13 10V13C13 13.2833 12.9042 13.5208 12.7125 13.7125C12.5208 13.9042 12.2833 14 12 14H8ZM9 9H11V8C11 7.71667 10.9042 7.47917 10.7125 7.2875C10.5208 7.09583 10.2833 7 10 7C9.71667 7 9.47917 7.09583 9.2875 7.2875C9.09583 7.47917 9 7.71667 9 8V9Z"
              fill="#0052CC"
            />
          </svg>
        </i>

        <div className="w-full text-center sm:text-left">
          <h1 className="headline-lg text-center sm:text-left">
            Forgot password?
          </h1>
          <p className="body-md text-slate-2 text-center sm:text-left">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-6 mt-5"
        >
          {/* email field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="uppercase label-sm">
              Email address
            </label>
            <div className="relative">
              <Input
                {...register("email")}
                id="email"
                type="text"
                placeholder="yourname@company.com"
                required
                variant={errors.email ? "error" : "primary"}
                className="rounded-sm!"
              />
            </div>
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* submit button */}
          <Button
            type="submit"
            className={`w-full flex justify-center items-center rounded-sm! gap-2 ${isLoading && `opacity-70 cursor-not-allowed!`}`}
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            Send Reset Link
          </Button>
          <Link
            href={"/login"}
            className="flex items-center gap-2 mx-auto mt-5 sm:mt-3 text-primary title-md hover:underline"
          >
            <LeftArrow />
            Back to log in
          </Link>
        </form>
      </div>
      {/* link reset section */}
      {submitted && (
        <section className="mt-8 sm:mt-10 sm:space-y-6 max-w-xl sm:max-w-md mx-auto bg-success/30 sm:bg-transparent">
          <div className="flex gap-3 sm:bg-success/30 p-4">
            <CircleCheck />
            <p className="body-md">
              If an account exists with this email, we&apos;ve sent a password
              reset link.
            </p>
          </div>
          <hr className="sm:hidden mx-4 border-slate-1" />
          <div className="flex sm:flex-col justify-between sm:justify-start items-center gap-6 px-4 sm:px-0">
            <p className="label-sm text-slate-2 uppercase">
              Didn&apos;t receive the email?
            </p>
            {resendAttempts < MAX_RESEND_ATTEMPTS ? (
              <Button
                variant="secondary"
                className="flex items-center justify-center py-4! gap-2 w-fit sm:w-full sm:bg-surface-low sm:text-slate-2"
                disabled={!canResend || isLoading}
                onClick={() => handleSubmit(onSubmit)()}
              >
                <span className="hidden sm:block">
                  <Timer />
                </span>
                {canResend ? "Resend Email" : `Resend in ${timeDisplay}`}
              </Button>
            ) : (
              <p className="text-sm text-slate-2 text-center">
                Maximum resend attempts reached. Please try again later.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ForgotPasswordFrom;
