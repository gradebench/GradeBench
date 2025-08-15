import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { 
  SiteLayout, 
  SitePage, 
  SiteHeader, 
  LeftNav, 
  RightNav, 
  SiteFooter 
} from "../components/templetes";
import { siteConfig } from "../configs/site";

// Mock next/link so Vitest doesn't break
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--mock-geist" }),
  Geist_Mono: () => ({ variable: "--mock-geist-mono" }),
}));

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
    }: {
      href: string;
      children: React.ReactNode;
    }) => <a href={href}>{children}</a>,
  };
});

// Mock data for testing
const mockCTA = {
  href: "/get-started",
  label: "Get Started",
};

const mockNavIndex = {
  element: <div>Logo</div>,
  href: "/test",
};

const mockNavMenu = [
  {
    label: "Test Link 1",
    href: "/test1",
  },
  {
    label: "Test Link 2",
    href: "/test2",
  },
];

// Mock ScreenRootLayout component
vi.mock("@/components/providers/Screen", () => ({
  ScreenRootLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="screen-root-layout">{children}</div>
  ),
}));

describe("SiteLayout", () => {
  it("renders the layout with header and footer", () => {
    render(
      <SiteLayout>
        <div data-testid="site-content">Content</div>
      </SiteLayout>
    );
    
    expect(screen.getByTestId("screen-root-layout")).toBeDefined();
    expect(screen.getByTestId("site-content")).toBeDefined();
    expect(screen.getByText("This is Footer")).toBeDefined();
  });
});

describe("SitePage", () => {
  it("renders the page content", () => {
    render(
      <SitePage>
        <div data-testid="page-content">Page Content</div>
      </SitePage>
    );
    
    expect(screen.getByTestId("page-content")).toBeDefined();
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeDefined();
    expect(mainElement.className).toContain("min-h-screen");
  });
});

describe("SiteHeader", () => {
  it("renders the header with navigation components", () => {
    render(<SiteHeader />);
    
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toBeDefined();
    expect(headerElement.className).toContain("sticky");
    
    // Check for the default CTA button
    const ctaLink = screen.getByRole("link", { name: siteConfig.header.CTA.label });
    expect(ctaLink).toBeDefined();
  });
});

describe("LeftNav", () => {
  it("renders with default navigation items", () => {
    render(<LeftNav />);
    
    // Check for the index link
    const indexLink = screen.getByRole("link", { name: "" }); // GradeBench component doesn't have text
    expect(indexLink).toBeDefined();
    expect(indexLink.getAttribute("href")).toBe(siteConfig.header.navigation.index.href);
    
    // Check for menu items
    siteConfig.header.navigation.menu.forEach((item) => {
      const menuLink = screen.getByRole("link", { name: item.label });
      expect(menuLink).toBeDefined();
      expect(menuLink.getAttribute("href")).toBe(item.href);
    });
  });
  
  it("renders with custom navigation items", () => {
    render(<LeftNav index={mockNavIndex} menu={mockNavMenu} />);
    
    // Check for custom index link
    const indexLink = screen.getByText("Logo").closest("a");
    expect(indexLink).toBeDefined();
    expect(indexLink?.getAttribute("href")).toBe("/test");
    
    // Check for custom menu items
    mockNavMenu.forEach((item) => {
      const menuLink = screen.getByRole("link", { name: item.label });
      expect(menuLink).toBeDefined();
      expect(menuLink.getAttribute("href")).toBe(item.href);
    });
  });
});

describe("RightNav", () => {
  it("renders the CTA button with correct label and link", () => {
    render(<RightNav cta={mockCTA} />);
    const ctaLink = screen.getByRole("link", { name: /get started/i });

    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute('href')).toBe('/get-started');
  });

  it("renders the menu button for mobile", () => {
    render(<RightNav cta={mockCTA} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("uses default CTA if none is passed", () => {
    // Spy on siteConfig to check usage
    const { container } = render(<RightNav />);
    // Use container.querySelector to avoid the multiple elements issue
    const defaultCta = container.querySelector(`a[href="${siteConfig.header.CTA.href}"]`);
    expect(defaultCta).not.toBeNull();
    expect(defaultCta?.textContent).toBe(siteConfig.header.CTA.label);
  });
});

describe("SiteFooter", () => {
  it("renders the footer content", () => {
    render(<SiteFooter />);
    
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeDefined();
    expect(screen.getByText("This is Footer")).toBeDefined();
  });
});
