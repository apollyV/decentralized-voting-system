export type ProposalCreationModel = {
    title: string;
    description: string;
    endDate: number | null;
}

export enum VoteChoice {
  For = 0,
  Against = 0,
}

export type Vote = {
  voter: string;
  choice: VoteChoice;
};

export type Proposal = {
    id: number;
    title: string;
    description: string;
    author: string;
    startDate: Date;
    endDate: Date;
    votes: Vote[];
    votesForCount: number;
    votesAgainstCount: number;
}