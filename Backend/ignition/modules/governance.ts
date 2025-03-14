import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GovernanceModule = buildModule("GovernanceModule", (m) => {
  // Deploy the Storage contract
  const ownerAdress = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"
  const governance = m.contract("Governance", [ownerAdress]);

  // Log the deployment
  console.log("Governance contract deployment initiated");

  return { governance };
});

export default GovernanceModule;