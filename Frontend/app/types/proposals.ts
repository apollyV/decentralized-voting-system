export type ProposalCreationModel = {
  title: string;
  description: string;
  endDate: number | null;
};

// struct Proposal {
//     string title;
//     string description;
//     address author;
//     uint256 startDate;
//     uint256 endDate;
//     Vote[] votes;
//     uint256 votesForCount;
//     uint256 votesAgainstCount;
// }

export enum VoteChoice {
  For = 0,
  Against = 0,
}

export type Vote = {
  voter: string;
  choice: VoteChoice;
};

export type Proposal = {
  title: string;
  description: string;
  author: string;
  startDate: Date;
  endDate: Date;
  votes: Vote[];
  votesForCount: number;
  votesAgainstCount: number;
};
