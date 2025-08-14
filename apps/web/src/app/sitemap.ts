import { siteConfig } from "@/features/site/configs/site";
import { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  const siteSitemap = Object.values(siteConfig.pages).flatMap(
    (value) => value.sitemap,
  );
  return [...siteSitemap];
};

export default sitemap;
