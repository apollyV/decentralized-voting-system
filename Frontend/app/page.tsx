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
import { Proposal } from "./types/proposals";

export default function Home() {
  const { address, isConnected } = useAccount();

  // États pour la création de proposition
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);

  const mockProposals: Proposal[] = [
    {
      title: "Réduction des impôts",
      description:
        "Proposition visant à réduire les impôts de 5% pour les PME.",
      author: "Alice Dupont",
      startDate: Date.now(),
      endDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 jours plus tard
      votes: [],
      votesForCount: 12,
      votesAgainstCount: 8,
    },
    {
      title: "Interdiction des plastiques à usage unique",
      description:
        "Remplacer les plastiques jetables par des alternatives biodégradables.",
      author: "Jean Martin",
      startDate: Date.now(),
      endDate: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 jours plus tard
      votes: [],
      votesForCount: 20,
      votesAgainstCount: 5,
    },
    {
      title: "Augmentation du salaire minimum",
      description: "Proposition pour augmenter le SMIC de 10%.",
      author: "Sophie Bernard",
      startDate: Date.now(),
      endDate: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 jours plus tard
      votes: [],
      votesForCount: 30,
      votesAgainstCount: 15,
    },
  ];

  // Remplace l'état des propositions par les données statiques
  useEffect(() => {
    setProposals(mockProposals);
  }, []);

  // État pour stocker les propositions
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalsCount, setProposalsCount] = useState<number>(-1);

  const [currentProposal, setCurrentProposal] = useState<Proposal>();

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
  // useEffect(() => {
  //   if (fetchedProposals) {
  //     console.log("Fetched proposals", fetchedProposals);
  //     setProposals(fetchedProposals);
  //   }
  // }, [fetchedProposals]);

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
          <Listbox
            aria-label="Actions"
            onAction={(key) =>
              setCurrentProposal(proposals.filter((p) => p.id === key)[0])
            }
          >
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
          currentProposal ? (
            <VotingCard
              author={currentProposal.author}
              title={currentProposal.title}
              description={currentProposal.description}
              startDate={currentProposal.startDate}
              endDate={currentProposal.endDate}
              onVoteFor={() => console.log("Vote for")}
              onVoteAgainst={() => console.log("Vote against")}
              isMinimalist={false}
              index={0}
            />
          ) : (
            <div>Nothing selected</div>
          )
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
