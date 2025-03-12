"use client"
import { useAccount } from "wagmi";
import {EventProvider} from "@/app/EventContext";
import SideBar from "@/app/components/SideBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function VoteLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const { address, isConnected } = useAccount();
    
    return (
        <EventProvider>
            {isConnected ? (
                <div className="flexgap-2 p-8">
                    <div className="flex-col">
                        <ConnectButton />
                    </div>
                    <main className="flex-col grid grid-cols-12 gap-8 mt-8 w-full">
                        <div className="col-span-3 h-screen overflow-auto">
                            <SideBar/>
                        </div>
                        <div className="col-span-9">
                            {children}
                        </div>
                    </main>
                </div>
            ): (
                <div className="text-center mt-20">
                    <h2 className="text-xl font-semibold mb-4">
                        Bienvenue sur la DApp Governance
                    </h2>
                    <p className="text-gray-400">
                        Veuillez connecter votre portefeuille pour interagir avec la
                        blockchain.
                    </p>
                </div>
            )}
        </EventProvider>
    )
}