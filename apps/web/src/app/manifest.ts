import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => {
	return {
		name: "GradeBench",
		short_name: "GB",
		description:
			"GradeBench is an innovative education technology company dedicated to transforming the evaluation space with cutting-edge tools and solutions.",
		start_url: "./",
		display: "standalone",
		background_color: "white",
		theme_color: "black",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
};

export default manifest;
