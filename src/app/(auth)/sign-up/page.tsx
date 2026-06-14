import SignUpForm from "@/src/components/common/auth/SignUpForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-12 px-6 sm:px-12 rounded-sm sm:bg-white max-w-xl mx-auto my-12 sm:shadow-lg">
      <div className="flex flex-col gap-4">
        <h1 className="headline-lg">Create your workspace</h1>
        <p className="body-md text-slate-2 text-center hidden sm:block">
          Join the editorial approach to task management.
        </p>
        <p className="body-md text-slate-2 sm:hidden">
          Join the curated environment for institutional trust and task
          precision.
        </p>
      </div>
      <SignUpForm />
      <div className="flex items-center gap-1">
        <p className="body-md text-slate-2">Already have an account?</p>
        <Link
          href={"/login"}
          className="text-primary font-bold hover:underline"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
