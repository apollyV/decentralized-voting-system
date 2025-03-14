const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Governance - Tests Complets", () => {
    let governance;
    let owner, user1, user2, user3;

    before(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();
    });

    beforeEach(async () => {
        await network.provider.send("hardhat_reset");
        const Governance = await ethers.getContractFactory("Governance");
        governance = await Governance.deploy(owner.address);
    });

    describe("Création de Propositions", () => {
        it("Devrait créer une proposition avec des paramètres valides", async () => {
            const start = Math.floor(Date.now() / 1000) + 100;
            const end = start + 3600;

            await governance.connect(user1).createProposal(
                "Titre",
                "Description",
                start,
                end
            );

            const proposal = await governance.getProposalById(await getLatestProposalId());
            expect(proposal.title).to.equal("Titre");
            expect(proposal.author).to.equal(user1.address);
        });

        it("Devrait échouer avec des timestamps invalides", async () => {
            await expect(
                governance.connect(user1).createProposal("", "", 0, 100)
            ).to.be.revertedWith("StartDate timestamp must be greater than zero");

            await expect(
                governance.connect(user1).createProposal("", "", 100, 0)
            ).to.be.revertedWith("EndDate timestamp must be greater than zero");
        });
    });

    describe("Système de Vote", () => {
        let proposalId;

        beforeEach(async () => {
            proposalId = await createProposal(user1, 100, 3600);
        });

        it("Devrait accepter un vote valide", async () => {
            await network.provider.send("evm_increaseTime", [101]);
            await network.provider.send("evm_mine");
            await governance.connect(user1).vote(proposalId, true, "Raison");
            const proposal = await governance.getProposalById(proposalId);
            expect(proposal.votesForCount).to.equal(1);
        });

        it("Devrait bloquer le double vote", async () => {
            await network.provider.send("evm_increaseTime", [101]);
            await network.provider.send("evm_mine");
            await governance.connect(user1).vote(proposalId, true, "");
            await expect(
                governance.connect(user1).vote(proposalId, false, "")
            ).to.be.revertedWith("Already voted");
        });

        it("Devrait bloquer les votes avant le startDate", async () => {
            await expect(
                governance.connect(user2).vote(proposalId, true, "")
            ).to.be.revertedWith("Voting period has not started");
        });

        it("Devrait bloquer les votes après le endDate", async () => {
            await network.provider.send("evm_increaseTime", [3701]);
            await network.provider.send("evm_mine");
            await expect(
                governance.connect(user2).vote(proposalId, true, "")
            ).to.be.revertedWith("Voting period has ended");
        });
    });

    describe("Gestion des Propositions", () => {
        let proposalId;

        beforeEach(async () => {
            proposalId = await createProposal(user1, 0, 0);
        });

        it("Devrait permettre la suppression par l'auteur", async () => {
            await governance.connect(user1).removeProposal(proposalId);
            await expect(governance.getProposalById(proposalId))
                .to.be.revertedWith("Proposal does not exist");
        });

        it("Devrait permettre la suppression par l'owner", async () => {
            await governance.connect(owner).removeProposal(proposalId);
            await expect(governance.getProposalById(proposalId))
                .to.be.revertedWith("Proposal does not exist");
        });

        it("Devrait bloquer la suppression par un non-autorisé", async () => {
            await expect(
                governance.connect(user2).removeProposal(proposalId)
            ).to.be.revertedWith("You are not allowed to remove this proposal");
        });

        it("Devrait retirer la proposition des proposalIds", async () => {
            const initialCount = await governance.getProposalCount();
            await governance.connect(user1).removeProposal(proposalId);
            const newCount = await governance.getProposalCount();
            expect(newCount).to.equal(initialCount - 1);
        });
    });

    describe("Fonctions de Consultation", () => {
        beforeEach(async () => {
            await createProposal(user1, 0, 0);
            await createProposal(user2, 0, 0);
        });

        it("Devrait retourner toutes les propositions", async () => {
            const proposals = await governance.getProposals();
            expect(proposals.length).to.equal(2);
        });

        it("Devrait gérer les IDs inexistants", async () => {
            await expect(
                governance.getProposalById(999)
            ).to.be.revertedWith("Proposal does not exist");
        });
    });

    describe("Gestion des Permissions", () => {
        it("Devrait maintenir initialOwner après transfert", async () => {
            await governance.connect(owner).transferOwnership(user2.address);
            expect(await governance.initialOwner()).to.equal(owner.address);
            expect(await governance.owner()).to.equal(user2.address);
        });
    });

    describe("Cas Limites", () => {
        it("Devrait générer des IDs uniques", async () => {
            await network.provider.send("evm_setNextBlockTimestamp", [1000]);
            await network.provider.send("evm_mine");
            await governance.connect(user1).createProposal("A", "", 1001, 2000);

            await network.provider.send("evm_setNextBlockTimestamp", [1001]);
            await network.provider.send("evm_mine");
            await governance.connect(user1).createProposal("B", "", 1002, 2000);

            const proposals = await governance.getProposals();
            expect(proposals[0].id).to.not.equal(proposals[1].id);
        });

        it("Devrait gérer 100 votes simultanés", async () => {
            const proposalId = await createProposal(user1, 0, 10000);
            await network.provider.send("evm_increaseTime", [1]);
            await network.provider.send("evm_mine");

            for(let i = 0; i < 100; i++) {
                const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
                await user1.sendTransaction({
                    to: wallet.address,
                    value: ethers.parseEther("1")
                });
                await governance.connect(wallet).vote(proposalId, true, "");
            }

            const proposal = await governance.getProposalById(proposalId);
            expect(proposal.votesForCount).to.equal(100);
        });
    });

    // Helpers
    async function createProposal(signer, startOffset = 0, duration = 3600) {
        const start = Math.floor(Date.now() / 1000) + startOffset;
        const end = start + duration;
        await governance.connect(signer).createProposal("Test", "Test", start, end);
        return getLatestProposalId();
    }

    async function getLatestProposalId() {
        const proposals = await governance.getProposals();
        return proposals.length > 0 ? proposals[proposals.length - 1].id : null;
    }
});
