import {Vote} from "@/app/types/proposals";

export default function ProposalVotes({votes}: Readonly<{ votes: Vote[] }>) {
    return (
        <div>
            <p>Votes</p>

            {votes && votes.length > 0 ? (
                <div>
                    {votes.map((vote, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-lg">
                            <p>{vote.voter}</p>
                            <p>{vote.choice}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun vote</p>
            )}
        </div>
    )
}