"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { contractAbi, contractAddress } from "@/constants";
import { Listbox, ListboxItem } from "@heroui/react";

import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import VotingCard from "./components/voting-card/VotingCard";

export default function Home() {
  const { address, isConnected } = useAccount();

  // États pour la création de proposition
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);

  // État pour stocker les propositions
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalsCount, setProposalsCount] = useState<number>(-1);

  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: fetchedProposals } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposals",
  });

  const { data: fetchedProposalsCount, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalCount",
  });

  // Mettre à jour les propositions lorsqu'elles sont récupérées
  useEffect(() => {
    if (fetchedProposals) {
      console.log("Fetched proposals", fetchedProposals);
      setProposals(fetchedProposals);
    }
  }, [fetchedProposals]);

  // Mettre à jour les propositions lorsqu'elles sont récupérées
  useEffect(() => {
    console.log("useEffect triggered", fetchedProposalsCount);
    if (typeof fetchedProposalsCount === "bigint") {
      console.log("Fetched proposals count", fetchedProposalsCount);
      setProposalsCount(Number(fetchedProposalsCount));
    } else {
      console.log("fetchedProposalsCount is undefined or not a bigint");
    }
  }, [fetchedProposalsCount]);

  const createProposal = async () => {
    if (!title || !description || duration === null || duration <= 0) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "createProposal",
        args: [title, description, BigInt(duration)], // Vérifiez que duration est bien converti en BigInt
      });
    } catch (error) {
      console.error("Erreur lors de la création de la proposition :", error);
      alert("Une erreur s'est produite lors de la création de la proposition.");
    }
  };

  return (
    <main className="grid grid-cols-12 w-full">
      <div className="col-span-3 h-screen overflow-auto">
        {/* Liste des propositions */}
        <h2 className="text-xl font-semibold mb-4">Liste des propositions</h2>
        {proposals.length > 0 ? (
          <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
            {proposals.map((proposal) => (
              <ListboxItem key={proposal.id}>{proposal.title}</ListboxItem>
            ))}
          </Listbox>
        ) : (
          <p>Aucune proposition pour le moment.</p>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Nombre de propositions</h2>
          {isLoading ? <p>Chargement...</p> : <p>{proposalsCount}</p>}
        </div>
      </div>
      <div className="col-span-9">
        <ConnectButton />
        {isConnected ? (
          <div>Hello World</div>
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
      </div>
    </main>
  );
}
