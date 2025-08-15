import { ScreenRootLayout } from "@/components/providers/Screen";
import { Button } from "@gb/ui/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@gb/ui/src/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { siteConfig } from "../configs/site";
import {
  HeaderCTAType,
  NavigationIndexType,
  NavigationMenuItemType,
} from "../types/site";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ScreenRootLayout>
        <SiteHeader />
        {children}
        <SiteFooter />
      </ScreenRootLayout>
    </>
  );
};

export const SitePage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
};

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

export const LeftNav = ({
  index = siteConfig.header.navigation.index,
  menu = siteConfig.header.navigation.menu,
}: {
  index?: NavigationIndexType;
  menu?: NavigationMenuItemType[];
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
              {menu.map((item, index) => (
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

export const RightNav = ({
  cta = siteConfig.header.CTA,
}: {
  cta?: HeaderCTAType;
}) => {
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

export const SiteFooter = () => {
  return (
    <>
      <footer>
        <div>This is Footer</div>
      </footer>
    </>
  );
};
