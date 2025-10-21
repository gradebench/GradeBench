import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: ["@gb/ui", "@gb-element/quicks"],
	webpack: (config) => {
		config.resolve.extensionAlias = {
			".js": [".js", ".ts", ".tsx"],
		};
		return config;
	},
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
