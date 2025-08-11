import { GradeBench } from "@/components/anim/GradeBench1";

const topNavigationConfig = {
  index: {
    icon: <GradeBench className="w-8" />,
    url: "/site/home",
  },
  list: [
    {
      label: "Home",
      url: "/site/home",
    },
    {
      label: "About",
      url: "/site/about",
      hasMenu: true,
    },
    {
      label: "Products",
      url: "/site/products",
    },
  ],
};

export default topNavigationConfig;
