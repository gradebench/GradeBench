import type { Metadata, MetadataRoute } from "next";
import type { JSX, ReactNode } from "react";

export interface SiteConfigType {
	pages: {
		[key: string]: {
			metadata: Metadata;
			sitemap: MetadataRoute.Sitemap;
			content: ReactNode;
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
	footer: {
		quicklinks: NavigationMenuItemType[];
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
