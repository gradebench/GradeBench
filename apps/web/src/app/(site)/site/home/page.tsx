import { SitePage } from "@/features/site-templates/components/Page";
import Navigation from "@/features/site-templates/components/TopNav";
import { H1 } from "@gb/ui/src/components/ui/typography";

const Page = () => {
  return (
    <>
      <SitePage>
        <H1>Home</H1>
      </SitePage>
    </>
  );
};

export default Page;
