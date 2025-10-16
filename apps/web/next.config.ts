import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: ["@gb/ui", "@gb-element/quicks"],
	async rewrites() {
		return [
			{
				source: "/",
				destination: "/site/home",
			},
		];
	},
};

export default nextConfig;
