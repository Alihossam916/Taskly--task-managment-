import SignUpForm from "@/src/components/common/auth/SignUpForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-12 rounded-sm bg-white max-w-xl mx-auto mb-12 shadow-lg">
      <h1 className="headline-lg">Create your workspace</h1>
      <p className="body-md text-slate-2">
        Join the editorial approach to task management.
      </p>
      <SignUpForm />
      <div className="flex items-center gap-1">
        <p className="body-md text-slate-2">Already have an account?</p>
        <Link href={"/login"} className="text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
