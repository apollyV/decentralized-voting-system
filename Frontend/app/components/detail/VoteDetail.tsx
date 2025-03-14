import {Vote} from "@/app/types/proposals";
import SingleVote from "./SingleVote";

export default function VoteDetail({votes}: { votes: Vote[] }) {
    return (
        <main>
            <h1 className="font-semibold text-lg border-b pb-2">Details</h1>
            <div className="flex flex-col gap-2 mt-4">
                {votes && votes.length > 0 ? votes.map((vote: Vote, index: number) => (
                    <SingleVote vote={vote} key={index}/>
                )) : (<div>No votes yet</div>)}
            </div>
        </main>
    );
}
