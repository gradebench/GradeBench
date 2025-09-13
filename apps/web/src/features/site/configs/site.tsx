import { GradeBench } from "@/components/anim/GradeBench1";

import { About } from "../components/about/About";
import { Features } from "../components/features/Features";
import { Home } from "../components/home/Home";
import {Products} from "../components/products/Products"
import { Solutions } from "../components/solutions/Solutions";
import { SiteConfigType } from "../types/site";

export const siteConfig: SiteConfigType = {
  pages: {
    home: {
      metadata: {
        title: "Automated Grading & AI Evaluation Platform | GradeBench",
        description:
          "GradeBench saves educators 95% of their time with AI-powered grading. Get instant, unbiased feedback and cut evaluation costs by 70%. Transform your institution today.",
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        },
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Home />,
    },
    about: {
      metadata: {
        title: "Our Mission to Empower Educators | About GradeBench",
        description:
          "Learn about the GradeBench mission to reduce educator workload and make academic evaluations quick, fair, and meaningful. Meet our dedicated founding team.",
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/site/about`,
        },
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/about`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <About />,
    },
    features: {
      metadata: {
        title:
          "AI Grading, Personalized Feedback & Analytics | GradeBench Features",
        description:
          "Explore GradeBench's powerful features: Grade in seconds with our AI, deliver personalized student feedback, and unlock performance insights with our analytics dashboard.",
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/site/features`,
        },
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/features`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Features />,
    },
    products: {
      metadata: {
        title: " GradeBench Co-Pilot | GradeBench Catalyst | GradeBench Insights | GradeBench Nexus | GradeBench",
        description:
          "GradeBench is the all-in-one AI-powered education platform. From automated grading with GradeBench Co-Pilot™, smart question generation with GradeBench Catalyst™, data-driven progress tracking through GradeBench Insights™, to full academic management via GradeBench Nexus™, we help educators save time, personalize learning, and drive student success across India.",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/products`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Products />,
    },
    solutions: {
      metadata: {
        title: "AI Grading for UPSC Coaching Institutes & Schools | GradeBench",
        description:
          "GradeBench offers a tailored solution for UPSC institutes to automate answer sheet evaluation, reduce turnaround time, and scale operations. Discover our playbook.",
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/site/solutions`,
        },
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/solutions`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Solutions />,
    },
    /* pricing: {
      metadata: {
        title: "Pricing & Plans | GradeBench",
        description:
          "Find the right GradeBench plan for your institution. Explore our flexible Pay-As-You-Use, Unlimited, and Enterprise pricing options. Simple and transparent.",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/pricing`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Products />,
    },
    contact: {
      metadata: {
        title: "Contact Us | GradeBench",
        description:
          "Get in touch with the GradeBench team. Request a free, personalized demo or ask a question about our automated evaluation platform. We're here to help.",
      },
      sitemap: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/site/contact`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        },
      ],
      content: <Products />,
    }, */
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
          label: "Features",
          href: "/site/features",
        },
        {
          label: "Solutions",
          href: "/site/solutions",
        },
        /* {
          label: "Pricing",
          href: "/site/pricing",
        },
        {
          label: "Contact Us",
          href: "/site/contact",
        }, */
      ],
    },
    CTA: {
      label: "Get Started",
      href: "#",
    },
  },
  footer: {
    quicklinks: [
      {
        label: "Home",
        href: "/site/home",
      },
      {
        label: "About Us",
        href: "/site/about",
      },
      {
        label: "Features",
        href: "/site/features",
      },
      {
        label: "Solutions",
        href: "/site/solutions",
      },
    ],
  },
};
