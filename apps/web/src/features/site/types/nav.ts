import { JSX } from "react";

export interface NavigationIndexType {
  href: string;
  element: JSX.Element;
}

export interface NavigationMenuType {
  items: NavigationItemType[];
}

export interface HeaderCTAType {
  href: string;
  label: string;
}

interface NavigationItemType {
  href: string;
  label: string;
}
