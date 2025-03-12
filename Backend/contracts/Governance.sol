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
    IERC20 public imtToken;

    constructor(address imtTokenAddress, address initialOwner) Ownable(initialOwner) {
        imtToken = IERC20(imtTokenAddress);
    }

    function createProposal(string memory title, string memory description, uint256 startDateTimestamp, uint256 endDateTimestamp) public {
        require(startDateTimestamp > 0, "StartDate timestamp must be greater than zero");
        require(endDateTimestamp > 0, "EndDate timestamp must be greater than zero");

        uint256 proposalId = generateId();

        // Crée un nouveau struct Proposal et initialise ses champs
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.author = msg.sender;
        newProposal.startDate = startDateTimestamp;
        newProposal.endDate = endDateTimestamp;
        newProposal.votesForCount = 0;
        newProposal.votesAgainstCount = 0;

        // Ajoute l'ID de la proposition à la liste des IDs
        proposalIds.push(proposalId);
    }
    
    function generateId() internal view returns (uint256) {
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

        require(_hasNotVoted(proposal, msg.sender), "Already voted");
        require(block.timestamp <= proposal.endDate, "Voting period has ended");
        //require(imtToken.balanceOf(msg.sender) > 0, "No tokens to vote");

        VoteChoices choice = forVote ? VoteChoices.For : VoteChoices.Against;

        // Enregistre le vote
        proposal.votes.push(Vote(msg.sender, choice, description));

        // Met à jour les compteurs
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
    
    function _getProposalFromId(uint256 proposalId) internal view returns (Proposal storage) {
        return proposals[proposalId];
    }

    function _doesProposalExist(uint256 proposalId) internal view returns (bool) {
        return proposals[proposalId].id != 0;
    }

    /*function executeProposal(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.votes.length > proposal.votes.length, "Not enough votes in favor");
        require(block.timestamp > proposal.endDate, "Voting period has not ended");
        require(!proposal.executed, "Already executed");

        // Exécute la proposition (marqué comme exécutée)
        proposal.executed = true;
    }*/
}
