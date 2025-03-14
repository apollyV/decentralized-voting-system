import VotingResults from "@/app/components/VotingResults";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { contractAbi, contractAddress } from "@/constants";

export default function VotingCard({
  proposalId,
  title,
  description,
  author,
  startDate,
  endDate,
  votesForCount,
  votesAgainstCount,
}: {
  proposalId: number;
  title: string;
  description: string;
  author: string;
  startDate: Date;
  endDate: Date;
  votesForCount: number;
  votesAgainstCount: number;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isVoteFor, setIsVoteFor] = useState<boolean>(false);

  const { data: hash, writeContract } = useWriteContract();

  const handleVote = (explanations: string) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "vote",
      args: [BigInt(proposalId), isVoteFor, explanations],
    });
    onClose();
  };

  const calculateVotePercentFor = (
    votesForCount: number,
    votesAgainstCount: number
  ) => (votesForCount / (votesForCount + votesAgainstCount)) * 100;

  const onVote = (voteFor: boolean) => {
    setIsVoteFor(voteFor);
    onOpen();
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    handleVote(Object.fromEntries(data).explanations as string);
  };

  return (
    <div className="flex flex-col gap-4 px-8">
      <div className="text-xl font-semibold uppercase border-b pb-2 items-center">{title}</div>
      <div className="flex flex-col gap-2 w-full">
        {(votesForCount > 0 || votesAgainstCount > 0) && (
            <VotingResults
                percentFor={calculateVotePercentFor(
                    votesForCount,
                    votesAgainstCount
                )}
            />
        )}
        
        <div>
          <span className="font-semibold">Author : </span>
          <span>{author}</span>
        </div>
        <div>
          <span className="font-semibold">Voting period : </span>
          <span>
            {startDate.toDateString()} - {endDate.toDateString()}
          </span>
        </div>
        <div>
          <span>{description}</span>
        </div>
        <div className="flex justify-end w-full gap-4">
          <Button
            color="success"
            onPress={() => onVote(true)}
            className="text-white rounded-md"
            endContent={<HandThumbUpIcon className="size-5" />}
          >
            For
          </Button>
          <Button
            color="danger"
            onPress={() => onVote(false)}
            className="rounded-md"
            endContent={<HandThumbDownIcon className="size-5" />}
          >
            Against
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            className="rounded-md"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Confirming vote
                  </ModalHeader>
                  <ModalBody>
                    <Form onSubmit={onSubmit} className="flex flex-col gap-8">
                      <Textarea
                        isRequired
                        label="Explanations"
                        labelPlacement="outside"
                        name="explanations"
                        placeholder="Enter a detailed explanations"
                        minRows={3}
                        maxRows={8}
                      />
                      <Button
                        type="submit"
                        className="rounded-md w-full text-white"
                        color={isVoteFor ? "success" : "danger"}
                        size="lg"
                      >
                        Submit vote {isVoteFor ? "for" : "against"}
                      </Button>
                    </Form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
