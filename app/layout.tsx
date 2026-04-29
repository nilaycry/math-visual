import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://math-visual-nu.vercel.app"),
  title: "nilay — math, visualized",
  description:
    "Interactive math lessons on Fourier series, gradient descent, and eigenvalues. Built at UIUC.",
  keywords: [
    "math",
    "interactive",
    "visualization",
    "fourier",
    "linear algebra",
    "calculus",
    "uiuc",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans"
        style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
