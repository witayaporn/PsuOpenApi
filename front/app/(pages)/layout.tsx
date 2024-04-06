import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
import BottomNavbar from "../components/bottomNavbar"
import HeadNavbar from "../components/headNavbar"

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PSU GUIDE",
  description: "PSU Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="main-font">
        <HeadNavbar/>
        <div className="py-20 px-7 md:px-20 lg:px-40 xl:px-96">
          {children}
        </div>
        <BottomNavbar/>
      </body>
    </html>
  );
}
