import { LeftNav, RightNav } from "./TopNav";

export const SiteHeader = () => {
  return (
    <>
      <header className="sticky top-0 border-b px-4 backdrop-blur-3xl md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <LeftNav />
          {/* Right side */}
          <RightNav />
        </div>
      </header>
    </>
  );
};
