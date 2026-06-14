import Link from "next/link";
import LoginForm from "@/src/components/common/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-12 pb-0 sm:py-12 px-6 sm:px-12 rounded-sm sm:bg-white max-w-xl mx-auto my-12 sm:shadow-lg">
      <h1 className="headline-lg text-center">Welcome Back</h1>
      <p className="body-md text-slate-2 text-center">
        Please enter your details to access your workspace
      </p>
      <LoginForm />
      <div className="flex items-center gap-1 mt-32 sm:mt-0">
        <p className="body-md text-slate-2">Don&apos;t have an account? </p>
        <Link
          href={"/sign-up"}
          className="text-primary font-bold hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
