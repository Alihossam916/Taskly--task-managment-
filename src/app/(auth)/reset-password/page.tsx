import Link from "next/link";
import ResetPasswordForm from "@/src/components/common/auth/resetPasswordForm";

const ResetPassword = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="flex flex-col justify-center items-center gap-2 bg-white shadow-lg p-4 rounded-sm w-lg h-52 mb-32">
          <p className="text-error body-md">Invalid or expired reset link.</p>
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-12 px-6 sm:px-12 rounded-sm sm:bg-white max-w-xl mx-auto mb-12 sm:shadow-lg">
      <div className="flex flex-col gap-4 text-center sm:text-left">
        <h1 className="headline-lg">Create a New Password</h1>
        <p className="body-md text-slate-2 text-center sm:text-left">
          Create a new, strong password to secure your workstation access.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPassword;
