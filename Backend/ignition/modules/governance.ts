import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GovernanceModule = buildModule("GovernanceModule", (m) => {
  // Deploy the Storage contract
  const governance = m.contract("Governance");

  // Log the deployment
  console.log("Governance contract deployment initiated");

  return { governance };
});

export default GovernanceModule;