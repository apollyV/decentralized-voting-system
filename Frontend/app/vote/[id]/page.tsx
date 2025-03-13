"use client";

import VotingCard from "@/app/components/voting-card/VotingCard";
import { Proposal, Vote } from "@/app/types/proposals";
import { contractAbi, contractAddress } from "@/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import VoteDetail from "@/app/components/VoteDetail";
import VotingResults from "@/app/components/VotingResults";

export default function Page() {
  const { id } = useParams();

  const { data: hash, writeContract } = useWriteContract();

  const [currentProposal, setCurrentProposal] = useState<Proposal>();
  const { data: fetchedProposal } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getProposalById",
    args: [BigInt(Number(id))],
  });

  const handleFetchedProposal = (proposal: any) => {
    console.log("handling", proposal);
  };

  useEffect(() => {
    console.log("fetched proposal", fetchedProposal);
    if (fetchedProposal) {
      const proposal: Proposal = {
        id: Number(fetchedProposal.id),
        title: fetchedProposal.title,
        description: fetchedProposal.description,
        author: fetchedProposal.author,
        startDate: fetchedProposal.startDate,
        endDate: fetchedProposal.endDate,
        votes: fetchedProposal.votes,
        votesForCount: 5, //Number(fetchedProposal.votesForCount),
        votesAgainstCount: 7, //Number(fetchedProposal.votesAgainstCount),
      };
      setCurrentProposal(proposal);
    }
  }, [fetchedProposal]);

  const handleVote = (vote: boolean) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "vote",
      args: [BigInt(currentProposal.id), vote, "blabla"],
    });
  };

  return (
    <div>
      {currentProposal ? (
        <div className="flex flex-col gap-4">
          <VotingCard
            author={currentProposal.author}
            title={currentProposal.title}
            description={currentProposal.description}
            startDate={currentProposal.startDate}
            endDate={currentProposal.endDate}
            onVoteFor={() => handleVote(true)}
            onVoteAgainst={() => handleVote(false)}
            index={0}
          />
          <VotingResults
            percentFor={
              (currentProposal.votesForCount /
                (currentProposal.votesForCount +
                  currentProposal.votesAgainstCount)) *
              100
            }
          />
          <section>
            {currentProposal.votes.map((vote: Vote, index: number) => (
              <VoteDetail vote={vote} key={index} />
            ))}
          </section>
        </div>
      ) : (
        <h2>No proposal found for id: {id}</h2>
      )}
    </div>
  );
}
