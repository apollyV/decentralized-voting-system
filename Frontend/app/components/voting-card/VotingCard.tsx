import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@heroui/react";

export default function VotingCard({
  title,
  description,
  author,
  startDate,
  endDate,
  onVoteFor,
  onVoteAgainst,
  index,
}: {
  title: string;
  description: string;
  author: string;
  startDate: Date;
  endDate: Date;
  onVoteFor: () => void;
  onVoteAgainst: () => void;
  index: number;
}) {
  const top = index * 3;

  return (
    <Card className="rounded-md">
      <CardHeader className="text-xl font-semibold uppercase h-11">
        {title}
      </CardHeader>

      <Divider />
      <CardBody>{description}</CardBody>
      <Divider />
      <CardFooter className="flex justify-end gap-2">
        <Button
          color="success"
          onPress={onVoteFor}
          className="text-white rounded-md"
        >
          For
        </Button>
        <Button color="danger" onPress={onVoteAgainst} className="rounded-md">
          Against
        </Button>
      </CardFooter>
    </Card>
  );
}
