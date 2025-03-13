import { Vote } from "@/app/types/proposals";
import SingleVote from "./SingleVote";

export default function VoteDetail({ votes }: { votes: Vote[] }) {
  return (
    <main>
      <h1 className="font-semibold text-lg mb-2">Details</h1>
      {votes.map((vote: Vote, index: number) => (
        <SingleVote vote={vote} key={index} />
      ))}
    </main>
  );
}
