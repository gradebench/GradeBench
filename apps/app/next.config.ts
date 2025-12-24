import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@gb/design-system", "@gb/query", "@gb/auth"],
};

export default nextConfig;
