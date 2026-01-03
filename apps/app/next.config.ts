import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@gb/auth", "@gb/design-system", "@gb/query"],
};

export default nextConfig;
