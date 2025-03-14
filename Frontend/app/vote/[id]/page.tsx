"use client";

import VotingCard from "@/app/components/voting-card/VotingCard";
import { Proposal } from "@/app/types/proposals";
import { contractAbi, contractAddress } from "@/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import VoteDetail from "@/app/components/detail/VoteDetail";

export default function Page() {
  const { id } = useParams();

  const [currentProposal, setCurrentProposal] = useState<Proposal>();
  const { data: fetchedProposal } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalById",
    args: [BigInt(Number(id))],
  });

  useEffect(() => {
    console.log("fetched proposal", fetchedProposal);
    if (fetchedProposal) {
      const proposal: Proposal = {
        id: Number(fetchedProposal.id),
        title: fetchedProposal.title,
        description: fetchedProposal.description,
        author: fetchedProposal.author,
        startDate: new Date(Number(fetchedProposal.startDate)),
        endDate: new Date(Number(fetchedProposal.endDate)),
        votes: fetchedProposal.votes,
        votesForCount: Number(fetchedProposal.votesForCount),
        votesAgainstCount: Number(fetchedProposal.votesAgainstCount),
      };
      setCurrentProposal(proposal);
      console.log("proposal", proposal);
    }
  }, [fetchedProposal]);

  return (
    <div>
      {currentProposal ? (
        <div className="flex gap-6 pt-6 h-screen w-full">
          <div className="border-r w-2/3">
            <VotingCard
              proposalId={currentProposal.id}
              author={currentProposal.author}
              title={currentProposal.title}
              description={currentProposal.description}
              startDate={currentProposal.startDate}
              endDate={currentProposal.endDate}
              votesForCount={currentProposal.votesForCount}
              votesAgainstCount={currentProposal.votesAgainstCount}
            />
          </div>
          <div className="w-1/3">
            <VoteDetail votes={currentProposal.votes} />
          </div>
        </div>
      ) : (
        <h2>No proposal found for id: {id}</h2>
      )}
    </div>
  );
}
