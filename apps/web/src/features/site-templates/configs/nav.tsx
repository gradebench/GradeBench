import { GradeBench } from "@/components/anim/GradeBench1";
import {
  HeaderCTAType,
  NavigationIndexType,
  NavigationMenuType,
} from "../types/nav";

export const navigationIndex: NavigationIndexType = {
  href: "/",
  element: <GradeBench />,
};

export const navigationMenu: NavigationMenuType = {
  items: [
    {
      label: "Home",
      href: "/site/home",
    },
    {
      label: "About Us",
      href: "/site/about",
    },
    {
      label: "Products",
      href: "/site/products",
    },
  ],
};

export const headerCTA: HeaderCTAType = {
  href: "#",
  label: "Get Started",
};

