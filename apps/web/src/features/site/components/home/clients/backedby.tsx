"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

interface ThemedImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
}

export const ThemedImage = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
}: ThemedImageProps) => {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === "dark" ? lightSrc : darkSrc}
      alt={alt}
      width={width}
      height={height}
    />
  );
};
