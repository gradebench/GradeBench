import Link from "next/link";
import topNavigationConfig from "../configs/nav";
import { TopNav } from "./TopNav";

export const SiteHeader = ({ navConfig = topNavigationConfig }) => {
  return (
    <>
      <header className="flex items-center p-2">
        <span className="grid w-16 place-items-center">
          <Link href={navConfig.index.url}>{navConfig.index.icon}</Link>
        </span>
        <TopNav navConfig={topNavigationConfig} />
      </header>
    </>
  );
};
