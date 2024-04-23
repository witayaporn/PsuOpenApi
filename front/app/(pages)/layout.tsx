
import type { Metadata } from "next";
import BottomNavbar from "../components/bottomNavbar"
import HeadNavbar from "../components/headNavbar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="main-font">
        <HeadNavbar/>
        <div className="pt-24 px-6 md:px-20 lg:px-40 xl:px-80">
          {children}
        </div>
        <BottomNavbar/>
      </body>
    </html>
  );
}
