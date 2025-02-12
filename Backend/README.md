# SimpleStorage Backend

This is the smart contract backend for the SimpleStorage project. It uses Hardhat for development and deployment, with TypeScript support throughout the codebase.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or pnpm
- A code editor (VS Code recommended)
- MetaMask or another Ethereum wallet

## Installation

1. Clone the repository and navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
# or if using pnpm
pnpm install
```

3. Create a `.env` file in the Backend directory with the following variables (needed for Sepolia deployment):
```env
SEPOLIA_RPC_URL="your_sepolia_rpc_url" # from Alchemy or Infura
PRIVATE_KEY="your_wallet_private_key"   # from your Ethereum wallet
ETHERSCAN_API_KEY="your_etherscan_key"  # for contract verification
```

## Available Commands

### Development

1. Start a local Hardhat node:
```bash
pnpm node
```

2. Deploy to localhost:
```bash
pnpm deploy:localhost
```
This will:
- Deploy the contract to your local network
- Update the frontend constants with the new contract address and ABI

### Testnet Deployment

Deploy to Sepolia testnet:
```bash
pnpm deploy:sepolia
```
Make sure you have:
- Set up your `.env` file with the required variables
- Sufficient Sepolia ETH in your wallet (get from a faucet)

### Cleanup

Remove all generated files:
```bash
pnpm clean
```
This removes:
- Hardhat cache
- Compiled artifacts
- TypeChain types
- Deployment files
- Coverage reports

## Project Structure

```
Backend/
├── contracts/           # Smart contracts
│   └── Storage.sol     # SimpleStorage contract
├── ignition/           # Hardhat Ignition deployment modules
│   └── modules/
│       └── storage.ts  # Storage deployment module
├── scripts/            # Utility scripts
│   └── update-frontend.ts  # Updates frontend with contract info
├── test/              # Contract tests
├── .env               # Environment variables (create this)
├── .gitignore        # Git ignore file
├── hardhat.config.ts  # Hardhat configuration
├── package.json      # Project dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Development Workflow

1. **Local Development**:
   ```bash
   # Terminal 1: Start local node
   pnpm node
   
   # Terminal 2: Deploy contract
   pnpm deploy:localhost
   ```
   The frontend constants (address and ABI) will be automatically updated.

2. **Making Changes**:
   - Modify contracts in the `contracts/` directory
   - Update deployment logic in `ignition/modules/` if needed
   - Run tests (if any) with `npx hardhat test`

3. **Testnet Deployment**:
   ```bash
   # Deploy to Sepolia
   npm run deploy:sepolia
   ```

## Adding Hardhat Network to MetaMask

To interact with your locally deployed contracts, you need to add the Hardhat network to MetaMask:

1. Open MetaMask and click on the network dropdown (usually shows "Ethereum Mainnet")
2. Click "Add network" > "Add a network manually"
3. Fill in the following details:
   ```
   Network Name: Hardhat Local
   New RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   ```
4. Click "Save"

**Important Notes**:
- The Hardhat node provides 20 test accounts, each loaded with 10,000 ETH
- Hardhat uses deterministic account generation, meaning the private keys are the same for everyone using Hardhat in development mode
- The default private key for the first account is:
  ```
  0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```
  This private key is consistent across all Hardhat installations for local development.

To import this account to MetaMask:
1. Click on your account icon in MetaMask
2. Click "Import Account"
3. Paste the private key above (without the 0x prefix)
4. Click "Import"

Note: This account will have 10,000 test ETH to use for development.

Additional Notes:
- Every time you restart the Hardhat node, the blockchain state is reset
- If you restart the node, you may need to:
  1. Reset your MetaMask account (Settings > Advanced > Reset Account)
  2. Switch to another network and back to Hardhat Local
  3. Reconnect your dApp to MetaMask

## Troubleshooting

1. **Node Already Running**:
   If you see `Error: listen EADDRINUSE: address already in use 127.0.0.1:8545`:
   - A node is already running
   - Either use the existing node or kill it and start fresh

2. **Deployment Fails**:
   - For localhost: Ensure your local node is running
   - For Sepolia:
     - Check your `.env` configuration
     - Ensure you have sufficient Sepolia ETH
     - Verify your RPC URL is working

3. **TypeScript Errors**:
   - Run `npm run clean` to remove generated files
   - Rebuild with `npx hardhat compile`

## Security

- Never commit your `.env` file
- Keep your private keys secure
- Use different accounts for development and production
- Always audit contracts before mainnet deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
