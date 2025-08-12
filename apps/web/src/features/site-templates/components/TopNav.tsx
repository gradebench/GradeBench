import { Button } from "@gb/ui/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@gb/ui/src/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { headerCTA, navigationIndex, navigationMenu } from "../configs/nav";
import {
  HeaderCTAType,
  NavigationIndexType,
  NavigationMenuType,
} from "../types/nav";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", label: "Home", active: true },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export const LeftNav = ({
  index = navigationIndex,
  menu = navigationMenu,
}: {
  index?: NavigationIndexType;
  menu?: NavigationMenuType;
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-6">
          <Link
            href={index.href}
            className="text-primary hover:text-primary/90"
          >
            {index.element}
          </Link>
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
              {menu.items.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={item.href}
                    className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </>
  );
};

export const RightNav = ({ cta = headerCTA }: { cta?: HeaderCTAType }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="max-md:hidden">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
        <Button size={"icon"} variant={"ghost"} className="md:hidden">
          <Menu />
        </Button>
      </div>
    </>
  );
};

export const MobileNavView = () => {
  return (
    <>
      <nav>
        
      </nav>
    </>
  )
};
