"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemedImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
}

export const ThemedImage = ({ lightSrc, darkSrc, alt, width, height }: ThemedImageProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark" || theme === "dark";

  if (!mounted) {
    return (
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={isDark ? darkSrc : lightSrc}
      alt={alt}
      width={width}
      height={height}
    />
  );
};