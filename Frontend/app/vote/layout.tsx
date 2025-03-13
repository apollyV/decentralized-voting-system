"use client";
import { useAccount } from "wagmi";
import { EventProvider } from "@/app/EventContext";
import SideBar from "@/app/components/SideBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Divider } from "@heroui/react";

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address, isConnected } = useAccount();

  return (
    <EventProvider>
      {isConnected ? (
        <div className="flex flex-col">
          <div className="p-4">
            <ConnectButton />
          </div>
          <main className="grid grid-cols-12 w-full border-t-2">
            <div className="col-span-3 h-screen overflow-auto border-r-2 p-4">
              <SideBar />
            </div>
            <div className="col-span-9 p-4">{children}</div>
          </main>
        </div>
      ) : (
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
  );
}
