import { Button } from "@gb/ui/src/components/ui/button";
import topNavigationConfig from "../configs/nav";
import Link from "next/link";

export const TopNav = ({ navConfig = topNavigationConfig }) => {
  return (
    <>
      <nav className="">
        <ul className="flex space-x-1">
          <li>
            <Button size={"sm"} variant={"ghost"}>
              <Link href={"/site/home"}>Home</Link>
            </Button>
          </li>
          <li>
            <Button size={"sm"} variant={"ghost"}>
              <Link href={"/site/about"}>About Us</Link>
            </Button>
          </li>
          <li>
            <Button size={"sm"} variant={"ghost"}>
              <Link href={"/site/products"}>Products</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
};
