import * as fs from 'fs';
import * as path from 'path';

type Network = 'localhost' | 'sepolia';

const updateFrontend = async (network: Network): Promise<void> => {
  try {
    // Find the first contract in the contracts folder
    const contractsDir = path.join(__dirname, '../contracts');
    const files = fs.readdirSync(contractsDir);
    const contractFile = files.find(file => file.endsWith('.sol'));
    
    if (!contractFile) {
      throw new Error('No Solidity contract found in contracts directory');
    }

    const contractName = path.basename(contractFile, '.sol');

    // Read the latest deployment from ignition/deployments
    const deploymentsDir = path.join(__dirname, '../ignition/deployments');
    const deploymentFolders = fs.readdirSync(deploymentsDir);
    const latestDeployment = deploymentFolders[deploymentFolders.length - 1];
    const deploymentPath = path.join(deploymentsDir, latestDeployment, 'deployed_addresses.json');
    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')) as Record<string, string>;
    const contractAddress = Object.values(deploymentData)[0];

    // Get ABI from the artifact
    const artifactPath = path.join(__dirname, `../artifacts/contracts/${contractFile}/${contractName}.json`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abi = artifact.abi;

    // Update frontend constants
    const frontendPath = path.join(__dirname, '../../Frontend/constants/index.ts');
    const content = `// Auto-generated constants for ${contractName} contract on ${network} network
export const contractAbi = ${JSON.stringify(abi, null, 2)} as const;

export const contractAddress = "${contractAddress}" as const;`;

    fs.writeFileSync(frontendPath, content);

    console.log(`Frontend constants updated for ${contractName}:`);
    console.log(`Network: ${network}`);
    console.log(`Contract Address: ${contractAddress}`);
  } catch (error) {
    console.error('Error updating frontend constants:', (error as Error).message);
    process.exit(1);
  }
};

const network = process.argv[2] as Network;
if (!network || !['localhost', 'sepolia'].includes(network)) {
  console.error('Please provide a valid network (localhost or sepolia)');
  process.exit(1);
}

updateFrontend(network).catch(console.error);
