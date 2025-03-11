"use client"
import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import {Inter} from "next/font/google";
import "./globals.css";
import {HeroUIProvider} from "@heroui/react";
import SideBar from "@/app/components/SideBar";
import {EventProvider} from "@/app/EventContext";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                       children,
                                       onCreation
                                   }: {
    children: React.ReactNode;
    onCreation: () => void;
}) {

    return (
        <html lang="en">
        <body className={inter.className}>
        <CustomRainbowKitProvider>
            <HeroUIProvider>
                <main className="grid grid-cols-12 w-full">
                    <EventProvider>
                        <div className="col-span-3 h-screen overflow-auto">
                            <SideBar/>
                        </div>
                        <div className="col-span-9 p-8">
                            {children}
                        </div>
                    </EventProvider>
                </main>
            </HeroUIProvider>
        </CustomRainbowKitProvider>
        </body>
        </html>
    );
}
