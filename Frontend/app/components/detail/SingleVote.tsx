import { Vote, VoteChoice } from "@/app/types/proposals";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

export default function SingleVote({ vote }: { vote: Vote }) {
  return (
    <Card
      className={`${
        vote.choice == VoteChoice.For
          ? "border-success-500 bg-success-100"
          : "border-danger-500 bg-danger-100"
      } border-1 rounded-md`}
    >
      <CardHeader className="font-semibold">{vote.voter}</CardHeader>
      <CardBody>{vote.description}</CardBody>
    </Card>
  );
}
