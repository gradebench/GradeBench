"use client";

import { useTheme } from "@gb/design-system/providers/theme";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const ThemedImage = ({
	lightSrc,
	darkSrc,
	...props
}: Omit<ImageProps, "src"> & { lightSrc: string; darkSrc: string }) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return (
		mounted && (
			<Image src={resolvedTheme === "dark" ? darkSrc : lightSrc} {...props} />
		)
	);
};

export { ThemedImage };
