// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Governance is Ownable {
    struct Proposal {
        string title;
        string description;
        address author;
        uint256 startDate;
        uint256 endDate;
        address[] voteForAddresses;
        address[] voteAgainstAddresses;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256[] public proposalIds; // Liste des IDs des propositions
    IERC20 public imtToken;

    // Le constructeur exige l'adresse du token et celle du propriétaire
    constructor(address imtTokenAddress, address initialOwner) Ownable(initialOwner) {
        imtToken = IERC20(imtTokenAddress);
    }

    function createProposal(string memory title, string memory description, uint256 duration) public {
        require(duration > 0, "Duration must be greater than zero");

        uint256 proposalId = proposalIds.length; // Calcule l'ID de la nouvelle proposition
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        proposals[proposalId] = Proposal(
            title,
            description,
            msg.sender,
            startDate,
            endDate,
            new address[](0),
            new address[](0),
            false
        );

        proposalIds.push(proposalId); // Stocke le nouvel ID de proposition
    }
    
    function getProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalIds.length);
        for (uint256 i = 0; i < proposalIds.length; i++) {
            allProposals[i] = proposals[proposalIds[i]];
        }
        return allProposals;
    }

    function vote(uint256 proposalId, bool forVote) public {
        Proposal storage proposal = proposals[proposalId];
        require(_hasNotVoted(proposal, msg.sender), "Already voted");
        require(imtToken.balanceOf(msg.sender) > 0, "No tokens to vote");
        require(block.timestamp <= proposal.endDate, "Voting period has ended");

        if (forVote) {
            proposal.voteForAddresses.push(msg.sender);
        } else {
            proposal.voteAgainstAddresses.push(msg.sender);
        }
    }

    function executeProposal(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.voteForAddresses.length > proposal.voteAgainstAddresses.length, "Not enough votes in favor");
        require(block.timestamp > proposal.endDate, "Voting period has not ended");
        require(!proposal.executed, "Already executed");

        // Exécute la proposition (marqué comme exécutée)
        proposal.executed = true;
    }

    function getVotesFor(uint256 proposalId) public view returns (uint256) {
        return proposals[proposalId].voteForAddresses.length;
    }

    function getVotesAgainst(uint256 proposalId) public view returns (uint256) {
        return proposals[proposalId].voteAgainstAddresses.length;
    }

    function getProposalCount() public view returns (uint256) {
        return 0; // Retourne le nombre total de propositions
    }

    // Fonction utilitaire pour vérifier si une adresse a déjà voté
    function _hasNotVoted(Proposal storage proposal, address voter) internal view returns (bool) {
        if (_contains(proposal.voteForAddresses, voter)) return false;
        if (_contains(proposal.voteAgainstAddresses, voter)) return false;
        return true;
    }

    // Fonction utilitaire pour vérifier si un tableau contient une adresse
    function _contains(address[] storage array, address value) internal view returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }
}