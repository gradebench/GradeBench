import type { MetadataRoute } from "next";
import { env } from "@/configs/env.config";

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: `https://www.${env.server.BASE_DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `https://www.${env.server.BASE_DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `https://www.${env.server.BASE_DOMAIN}/features`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `https://www.${env.server.BASE_DOMAIN}/solutions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
};

export default sitemap;
