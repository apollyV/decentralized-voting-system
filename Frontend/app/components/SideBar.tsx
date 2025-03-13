"use client";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { Proposal } from "@/app/types/proposals";
import { contractAbi, contractAddress } from "@/constants";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventContext } from "@/app/EventContext";
import CreationModal from "./CreationModal";

export default function SideBar() {
  const router = useRouter();
  const { event } = useEventContext();

  useEffect(() => {
    if (event) {
      console.log("event catched !");
      refetchProposals();
      refetchProposals();
    }
  });

  // const mockProposals: Proposal[] = [
  //     {
  //         id: 1,
  //         title: "Réduction des impôts",
  //         description:
  //             "Proposition visant à réduire les impôts de 5% pour les PME.",
  //         author: "Alice Dupont",
  //         startDate: new Date(),
  //         endDate: new Date(), // 7 jours plus tard
  //         votes: [],
  //         votesForCount: 12,
  //         votesAgainstCount: 8,
  //     },
  //     {
  //         id: 2,
  //         title: "Interdiction des plastiques à usage unique",
  //         description:
  //             "Remplacer les plastiques jetables par des alternatives biodégradables.",
  //         author: "Jean Martin",
  //         startDate: new Date(),
  //         endDate: new Date(), // 10 jours plus tard
  //         votes: [],
  //         votesForCount: 20,
  //         votesAgainstCount: 5,
  //     },
  //     {
  //         id: 3,
  //         title: "Augmentation du salaire minimum",
  //         description: "Proposition pour augmenter le SMIC de 10%.",
  //         author: "Sophie Bernard",
  //         startDate: new Date(),
  //         endDate: new Date(), // 5 jours plus tard
  //         votes: [],
  //         votesForCount: 30,
  //         votesAgainstCount: 15,
  //     },
  // ];

  // État pour stocker les propositions
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalsCount, setProposalsCount] = useState<number>(-1);

  const [currentProposal, setCurrentProposal] = useState<Proposal>();

  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: fetchedProposals, refetch: refetchProposals } = useReadContract(
    {
      address: contractAddress,
      abi: contractAbi,
      functionName: "getProposals",
    }
  );

  const {
    data: fetchedProposalsCount,
    isLoading,
    refetch: refetchProposalsCount,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalCount",
  });

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

  return (
    <div>
      <CreationModal />

      {/* Liste des propositions */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Liste des propositions</h2>
        {proposals.length > 0 ? (
          <Listbox
            aria-label="Actions"
            onAction={(key) => router.push(`/vote/${key}`)}
          >
            {proposals.map((proposal: Proposal) => (
              <ListboxItem key={proposal.id}>{proposal.title}</ListboxItem>
            ))}
          </Listbox>
        ) : (
          <p>Aucune proposition pour le moment.</p>
        )}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Nombre de propositions</h2>
          {isLoading ? <p>Chargement...</p> : <p>{proposalsCount}</p>}
        </div>
      </div>
    </div>
  );
}
