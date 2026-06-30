// icons
import Logo from "@/src/components/icons/logo";

// component
import AcceptInvitation from "@/src/components/common/projects/acceptInvitation";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const { token } = await searchParams;
  return (
    <div className="flex flex-col justify-center items-center gap-4 bg-surface-low h-screen">
      <h4 className="flex items-center gap-2">
        <Logo />
        <span className="title-md uppercase font-bold text-slate-3">
          Taskly
        </span>
      </h4>
      <AcceptInvitation token={token} />
    </div>
  );
};

export default Page;
