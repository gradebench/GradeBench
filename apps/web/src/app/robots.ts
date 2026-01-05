import type { MetadataRoute } from "next";
import { env } from "@/configs/env.config";

const robots = (): MetadataRoute.Robots => {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
			},
		],
		sitemap: `https://www.${env.server.BASE_DOMAIN}/sitemap.xml`,
	};
};

export default robots;
