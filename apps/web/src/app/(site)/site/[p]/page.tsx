import { SitePage } from "@/features/site/components/templetes";
import { siteConfig } from "@/features/site/configs/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ p: string }>;
}): Promise<Metadata> => {
  const { p } = await params;
  const page = siteConfig.pages[p];

  return page.metadata;
};

export const revalidate = 86400; // 24 hours

export const generateStaticParams = async () => {
  return Object.keys(siteConfig.pages).map((value) => ({
    p: value,
  }));
};

const Page = async ({ params }: { params: Promise<{ p: string }> }) => {
  const { p } = await params;
  const page = siteConfig.pages[p];

  if (!page) return notFound();

  return (
    <>
      <SitePage>
        {page.sections.map((section, index) => (
          <Fragment key={index}>{section}</Fragment>
        ))}
      </SitePage>
    </>
  );
};

export default Page;
