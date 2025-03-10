"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { contractAbi, contractAddress } from "@/constants";

import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";

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
      console.log("Fetched proposals", fetchedProposals)
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
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-end mb-8">
            <ConnectButton />
          </div>

          {isConnected ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/20">
                <h1 className="text-2xl font-bold mb-6 text-center">
                  Governance DApp
                </h1>

                <div className="space-y-6">
                  {/* Formulaire pour créer une proposition */}
                  <div className="space-y-4">
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        placeholder="Titre de la proposition"
                        disabled={isConfirming}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Description de la proposition"
                        disabled={isConfirming}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <input
                        type="number"
                        onChange={(e) => setDuration(Number(e.target.value))}
                        value={duration ?? ""}
                        placeholder="Durée (en secondes)"
                        disabled={isConfirming}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={createProposal}
                        disabled={isConfirming}
                        className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      {isConfirming ? "Création en cours..." : "Créer une proposition"}
                    </button>
                  </div>

                  {/* Liste des propositions */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Liste des propositions</h2>
                    {proposals.length > 0 ? (
                        <ul className="space-y-4">
                          {proposals.map((proposal, index) => (
                              <li key={index} className="bg-white/5 p-4 rounded-lg">
                                <h3 className="font-bold">{proposal.title}</h3>
                                <p className="text-sm text-gray-300">{proposal.description}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  Auteur : {proposal.author}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  Début : {new Date(Number(proposal.startDate) * 1000).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  Fin : {new Date(Number(proposal.endDate) * 1000).toLocaleString()}
                                </p>
                                <p className={`text-xs mt-2 ${proposal.executed ? 'text-green-500' : 'text-red-500'}`}>
                                  Statut : {proposal.executed ? "Exécutée" : "Non exécutée"}
                                </p>
                              </li>
                          ))}
                        </ul>
                    ) : (
                        <p>Aucune proposition pour le moment.</p>
                    )}
                  </div>
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Nombre de propositions</h2>
                    {isLoading ? (
                        <p>Chargement...</p>
                    ) : (
                        <p>{proposalsCount}</p>
                    )}
                  </div>
                </div>
              </div>
          ) : (
              <div className="text-center mt-20">
                <h2 className="text-xl font-semibold mb-4">
                  Bienvenue sur la DApp Governance
                </h2>
                <p className="text-gray-400">
                  Veuillez connecter votre portefeuille pour interagir avec la blockchain.
                </p>
              </div>
          )}
        </div>
      </main>
  );
}
