export type Vote = {
  voter: string;
  forVote: boolean;
  description: string;
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