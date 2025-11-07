import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarProvider } from "@/components/navbar-context";
import { NavbarWrapper } from "@/components/navbar-wrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Climate-Fisheries",
  description: "Climate risks and future impacts on global marine biodiversity and fisheries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/assets/images/favicon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NavbarProvider>
          <NavbarWrapper />
          {children}
        </NavbarProvider>
      </body>
    </html>
  );
}
