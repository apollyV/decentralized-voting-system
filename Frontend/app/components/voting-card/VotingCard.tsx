import VotingResults from "@/app/components/VotingResults";
import {Button} from "@heroui/react";

export default function VotingCard({
                                       title,
                                       description,
                                       author,
                                       startDate,
                                       endDate,
                                       votesForCount,
                                       votesAgainstCount,
                                       onVoteFor,
                                       onVoteAgainst,
                                   }: {
    title: string;
    description: string;
    author: string;
    startDate: Date;
    endDate: Date;
    votesForCount: number;
    votesAgainstCount: number;
    onVoteFor: () => void;
    onVoteAgainst: () => void;
}) {

    const calculateVotePercentFor = (votesForCount: number, votesAgainstCount: number) => (votesForCount /
            (votesForCount +
                votesAgainstCount)) *
        100;

    return (
        <div className="flex flex-col gap-4 px-8">
            <div className="flex gap-2 text-xl font-semibold uppercase border-b pb-2 items-center">
                <div>{title}</div>
                <div className="flex-1">
                    <VotingResults
                        percentFor={calculateVotePercentFor(votesForCount, votesAgainstCount)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div>
                    <span className="font-semibold">Author : </span>
                    <span>{author}</span>
                </div>
                <div>
                    <span className="font-semibold">Voting period : </span>
                    <span>{startDate.toDateString()} - {endDate.toDateString()}</span>
                </div>
                <div>
                    <span>{description}</span>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <Button color="danger" onPress={onVoteAgainst} className="rounded-md">
                        Against
                    </Button>
                    <Button
                        color="success"
                        onPress={onVoteFor}
                        className="text-white rounded-md"
                    >
                        For
                    </Button>
                </div>
            </div>
        </div>
    );
}
