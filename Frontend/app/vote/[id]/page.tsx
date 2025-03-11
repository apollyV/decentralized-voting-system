"use client"

import VotingCard from "@/app/components/voting-card/VotingCard";
import {Proposal, Vote} from "@/app/types/proposals";
import {contractAbi, contractAddress} from "@/constants";
import { useParams } from "next/navigation";
import {useEffect, useState } from "react";
import { useReadContract } from "wagmi";

export default function Page() {
    const { id } = useParams()

    console.log('id', id)
    
    const [currentProposal, setCurrentProposal] = useState<Proposal>();
    const { data: fetchedProposal} = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "getProposalById",
        args: [BigInt(Number(id))],
    });
    
    const handleFetchedProposal = (proposal: any) => {
        console.log('handling', proposal)
    }
    
    useEffect(() => {
        console.log('fetched proposal', fetchedProposal)
        if (fetchedProposal) {
            const proposal: Proposal = {
                id: fetchedProposal.id,
                title: fetchedProposal.title,
                description: fetchedProposal.description,
                author: fetchedProposal.author,
                startDate: fetchedProposal.startDate,
                endDate: fetchedProposal.endDate,
                votes: fetchedProposal.votes,
                votesForCount: fetchedProposal.votesForCount,
                votesAgainstCount: fetchedProposal.votesAgainstCount,
            };
            setCurrentProposal(proposal);
        }
    }, [fetchedProposal]);
    
    return (
        <div>
            {currentProposal ? (
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
            ) : <h2>No proposal found for id: {id}</h2>}
        </div>
    )
}