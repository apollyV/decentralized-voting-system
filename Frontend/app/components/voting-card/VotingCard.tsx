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
  isMinimalist,
  index,
}: {
  title: string;
  description: string;
  author: string;
  startDate: Date;
  endDate: Date;
  onVoteFor: () => void;
  onVoteAgainst: () => void;
  isMinimalist: boolean;
  index: number;
}) {
  const top = index * 3;

  return (
    <Card className={isMinimalist ? `-mt-${top}` : ""}>
      <CardHeader
        className={`${
          isMinimalist ? "text-sm block" : "text-xl"
        } font-semibold uppercase h-11`}
      >
        {title}
      </CardHeader>

      <Divider />
      <CardBody>{description}</CardBody>
      <Divider />
      <CardFooter className="flex justify-end gap-2">
        <Button color="danger" onPress={onVoteAgainst}>
          Against
        </Button>
        <Button color="success" onPress={onVoteFor} className="text-white">
          For
        </Button>
      </CardFooter>
    </Card>
  );
}
