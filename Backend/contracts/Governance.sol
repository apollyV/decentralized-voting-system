// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Governance is Ownable {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address author;
        uint256 startDate;
        uint256 endDate;
        Vote[] votes;
        uint256 votesForCount;
        uint256 votesAgainstCount;
    }

    enum VoteChoices { For, Against }

    struct Vote {
        address voter;
        VoteChoices forVote;
        string description;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256[] public proposalIds;
    address owner;
    IERC20 public imtToken;

    constructor(address imtTokenAddress, address initialOwner) Ownable(initialOwner) {
        imtToken = IERC20(imtTokenAddress);
        owner = initialOwner;
    }

    function createProposal(string memory title, string memory description, uint256 startDateTimestamp, uint256 endDateTimestamp) public {
        require(startDateTimestamp > 0, "StartDate timestamp must be greater than zero");
        require(endDateTimestamp > 0, "EndDate timestamp must be greater than zero");

        uint256 proposalId = _generateId();

        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.author = msg.sender;
        newProposal.startDate = startDateTimestamp;
        newProposal.endDate = endDateTimestamp;
        newProposal.votesForCount = 0;
        newProposal.votesAgainstCount = 0;

        proposalIds.push(proposalId);
    }
    
    function _generateId() internal view returns (uint256) {
        return block.timestamp + block.number;
    }

    function getProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalIds.length);
        for (uint256 i = 0; i < proposalIds.length; i++) {
            allProposals[i] = proposals[proposalIds[i]];
        }
        return allProposals;
    }

    function getProposalCount() public view returns (uint256) {
        return proposalIds.length;
    }

    function vote(uint256 proposalId, bool forVote, string memory description) public {
        require(_doesProposalExist(proposalId), "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];

        require(_isProposalVotable(proposal), "Proposal cannot be voted on because voting period is outdated");
        require(_hasNotVoted(proposal, msg.sender), "Already voted");
        require(block.timestamp <= proposal.endDate, "Voting period has ended");

        VoteChoices choice = forVote ? VoteChoices.For : VoteChoices.Against;

        proposal.votes.push(Vote(msg.sender, choice, description));

        if (forVote) {
            proposal.votesForCount++;
        } else {
            proposal.votesAgainstCount++;
        }
    }
    
    function getProposalById(uint256 proposalId) public view returns (Proposal memory) {
        //require(_doesProposalExist(proposalId), 'Proposal does not exist');
        Proposal storage proposal = _getProposalFromId(proposalId);
        return proposal;
    }
    
    function _hasNotVoted(Proposal storage proposal, address voter) internal view returns (bool) {
        for (uint256 i = 0; i < proposal.votes.length; i++) {
            if (proposal.votes[i].voter == voter) {
                return false;
            }
        }
        return true;
    }
    
    function _isProposalVotable(Proposal storage proposal) internal view returns (bool) {
        return block.timestamp >= proposal.startDate && block.timestamp <= proposal.endDate;
    }
    
    function _getProposalFromId(uint256 proposalId) internal view returns (Proposal storage) {
        return proposals[proposalId];
    }

    function _doesProposalExist(uint256 proposalId) internal view returns (bool) {
        return proposals[proposalId].id != 0;
    }

    function removeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        address sender = msg.sender;
        if(sender == owner || sender == proposal.author) {
            delete proposals[proposalId];
        } else {
            revert("You are not allowed to remove this proposal");
        }
    }
}
