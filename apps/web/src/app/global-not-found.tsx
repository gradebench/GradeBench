import "@/styles/globals.css";
import { H1 } from "@gb/design-system/components/ui/typography";
import { ThemeProvider } from "@gb/design-system/providers/theme";
import { QueryProvider } from "@gb/query/provider";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GlobalNotFound = () => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <H1>Not Found</H1>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default GlobalNotFound;
