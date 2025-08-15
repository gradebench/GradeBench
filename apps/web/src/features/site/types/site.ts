import { Metadata, MetadataRoute } from "next";
import { JSX } from "react";

export interface SiteConfigType {
  pages: {
    [key: string]: {
      metadata: Metadata;
      sitemap: MetadataRoute.Sitemap;
      sections: JSX.Element[];
    };
  };
  header: {
    navigation: {
      index: {
        href: string;
        element: JSX.Element;
      };
      menu: NavigationMenuItemType[];
    };
    CTA: HeaderCTAType;
  };
}

export interface NavigationIndexType {
  href: string;
  element: JSX.Element;
}

export interface HeaderCTAType {
  href: string;
  label: string;
}

export interface NavigationMenuItemType {
  label: string;
  href: string;
}
