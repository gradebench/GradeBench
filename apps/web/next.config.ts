import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@gb/design-system", "@gb/query"],
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
