"use client";
import type { Metadata } from "next";
import BottomNavbar from "../components/bottomNavbar";
import HeadNavbar from "../components/headNavbar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="main-font">
                <SessionProvider>
                    <HeadNavbar />
                    <div className="pt-28 px-6 md:px-20 lg:px-40 xl:px-80 2xl:px-[28rem] mb-20 md:mb-0 ">
                        <Suspense>{children}</Suspense>
                    </div>
                    <BottomNavbar />
                </SessionProvider>
            </body>
        </html>
    );
}
