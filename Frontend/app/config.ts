import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Decentralized Voting System",
  projectId: "65af7ffc03881e7982d909862c11aa59",
  chains: [hardhat, sepolia, mainnet],
  ssr: true,
});
