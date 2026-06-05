import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="display-lg">Hello World!</h1>
      <div className="flex flex-col items-center gap-2 bg-slate-1">
        <Link href={"/login"}>login</Link>
        <Link href={"/sign-up"}>sign up</Link>
        <Link href={"/forgot-password"}>forgot password</Link>
      </div>
    </>
  );
}
