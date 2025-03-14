"use client";
import { Button, Divider, Listbox, ListboxItem } from "@heroui/react";
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
import ProposalDeletion from "./ProposalDeletion";
import "./sideBar.css";

export default function SideBar() {
  const router = useRouter();
  const { event } = useEventContext();

  useEffect(() => {
    if (event) {
      refetchProposals();
    }
  });

  // État pour stocker les propositions
  const [proposals, setProposals] = useState<any[]>([]);

  const { data: fetchedProposals, refetch: refetchProposals } = useReadContract(
    {
      address: contractAddress,
      abi: contractAbi,
      functionName: "getProposals",
    }
  );

  useEffect(() => {
    if (fetchedProposals) {
      setProposals(fetchedProposals);
    }
  }, [fetchedProposals]);

  return (
    <aside>
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
              <ListboxItem key={proposal.id}>
                <div className="flex justify-between place-items-center listItemSideBar">
                  <p>{proposal.title}</p>
                  <ProposalDeletion proposalId={proposal.id} />
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        ) : (
          <p>Aucune proposition pour le moment.</p>
        )}
      </div>
    </aside>
  );
}
