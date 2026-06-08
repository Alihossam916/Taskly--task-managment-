"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { loginApi } from "@/src/lib/api/auth/login";
import { setAuthTokens } from "@/src/lib/utils/cookies";
import { loginSchema, LoginFormData } from "@/src/lib/schemas/loginSchema";

// form handlers
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ui components
import Button from "../../ui/button";
import Input from "../../ui/input";
import Spinner from "../../ui/spinner";
import EyeIcon from "../../icons/eyeIcon";
import LockIcon from "../../icons/lockIcon";
import MailIcon from "../../icons/mailIcon";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // form submition logic
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginApi({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      // Handle error response
      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      // Extract tokens and user data
      if (response.access_token && response.refresh_token) {
        // Store tokens in secure cookies
        await setAuthTokens(
          response.access_token,
          response.refresh_token,
          response.expires_at, // Unix timestamp from API
          data.rememberMe, // 30-day session if checked
        );

        toast.success("Logged in successfully!");
        reset();

        // Redirect to main page
        router.push("/project");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-6 mt-5"
    >
      {/* email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="uppercase label-sm">
          Email <span className="sm:hidden">address</span>
        </label>
        <div className="relative">
          <Input
            {...register("email")}
            id="email"
            type="text"
            placeholder="yourname@company.com"
            required
            variant={errors.email ? "error" : "primary"}
            className="py-3"
          />
          <span className="sm:hidden absolute right-5 top-1/2 transform -translate-y-1/2">
            <MailIcon />
          </span>
        </div>

        {errors.email && (
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        )}
      </div>
      {/* password field */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="uppercase label-sm">
              password
            </label>
            <Link
              href="/forgot-password"
              className="sm:hidden text-primary font-bold"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              variant={errors.password ? "error" : "primary"}
              className="py-3"
            />
            {/* show password using eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hidden sm:block absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <EyeIcon />
            </button>
            {/* show lock icon on mobile screens */}
            <span className="sm:hidden absolute right-5 top-1/2 transform -translate-y-1/2">
              <LockIcon />
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            {...register("rememberMe")}
            type="checkbox"
            id="remember-me"
            className="cursor-pointer"
          />
          <label htmlFor="remember-me" className="cursor-pointer">
            Remember Me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="hidden sm:block text-primary font-bold"
        >
          Forgot Password?
        </Link>
      </div>

      {/* submit button */}
      <Button
        type="submit"
        className="w-full flex justify-center items-center gap-2"
        disabled={isLoading}
      >
        {isLoading && <Spinner />}
        <span className="hidden sm:inline">Log In</span>{" "}
        <span className="flex items-center gap-2 sm:hidden">
          Sign In
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.1458 7.5H0V5.83333H10.1458L5.47917 1.16667L6.66667 0L13.3333 6.66667L6.66667 13.3333L5.47917 12.1667L10.1458 7.5Z"
              fill="white"
            />
          </svg>
        </span>
      </Button>
    </form>
  );
};

export default LoginForm;
