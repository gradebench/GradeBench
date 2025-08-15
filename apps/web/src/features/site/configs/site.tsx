import { GradeBench } from "@/components/anim/GradeBench1";
import { SiteConfigType } from "../types/site";

export const siteConfig: SiteConfigType = {
  pages: {
    home: {
      metadata: {
        title: "Home | GradeBench",
        description:
          "GradeBench is an innovative education technology company dedicated to transforming the evaluation space with cutting-edge tools and solutions.",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
    },
    about: {
      metadata: {
        title: "About Us | GradeBench",
        description: "-",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/about`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
    },
    products: {
      metadata: {
        title: "Products | GradeBench",
        description: "-",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/products`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
    },
  },
  header: {
    navigation: {
      index: {
        element: <GradeBench />,
        href: "/",
      },
      menu: [
        {
          label: "Home",
          href: "/site/home",
        },
        {
          label: "About Us",
          href: "/site/about",
        },
        {
          label: "Product",
          href: "/site/products",
        },
      ],
    },
    CTA: {
      label: "Get Started",
      href: "#",
    },
  },
};
