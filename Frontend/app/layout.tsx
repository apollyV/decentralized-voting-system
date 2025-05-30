"use client"
import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import {Inter} from "next/font/google";
import "./globals.css";
import {HeroUIProvider} from "@heroui/react";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
        <body className={inter.className}>
        <CustomRainbowKitProvider>
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        </CustomRainbowKitProvider>
        </body>
        </html>
    );
}
