import Link from "next/link";

// icons
import Logo from "@/src/components/icons/logo";
import LogoMobile from "@/src/components/icons/logoMobile";

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-surface-low min-h-screen flex flex-col flex-1">
      <header className="p-6">
        <Link href={"/"} className="flex gap-2 items-center w-fit">
          <Logo className="hidden sm:block" />
          <LogoMobile className="sm:hidden" />
          <h2 className="title-md font-bold uppercase">Taskly</h2>
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default SignUpLayout;
