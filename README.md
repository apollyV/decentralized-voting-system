# SimpleStorage DApp

A full-stack decentralized application (DApp) built with Next.js, TypeScript, Hardhat, and RainbowKit. This project demonstrates a simple storage contract implementation with a modern web frontend.

## Project Structure

```
├── Frontend/           # Next.js web application
│   ├── app/           # Next.js app directory
│   ├── constants/     # Contract addresses and ABIs
│   └── public/        # Static assets
│
└── Backend/           # Hardhat smart contract project
    ├── contracts/     # Solidity smart contracts
    ├── ignition/      # Deployment modules
    └── scripts/       # Utility scripts
```

## Prerequisites

- Node.js (v18 or later recommended)
- npm or pnpm
- MetaMask or another Ethereum wallet
- Git

## Quick Start

1. Clone the repository:
```bash
git clone [your-repo-url]
cd SimpleStorage-NextJS-Wagmi-RainbowKit-Typescript
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Backend (create `Backend/.env`):
   ```env
   SEPOLIA_RPC_URL="your_sepolia_rpc_url"  # from Alchemy or Infura
   PRIVATE_KEY="your_wallet_private_key"    # from your Ethereum wallet
   ETHERSCAN_API_KEY="your_etherscan_key"   # for contract verification
   ```

## Development Workflow

1. Start the local Hardhat node:
```bash
pnpm node
```

2. In a new terminal, deploy the contract locally:
```bash
pnpm deploy:local
```
This will:
- Deploy the contract to your local network
- Automatically update the frontend with the new contract address and ABI

3. Start the frontend development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contract Development

### Available Commands

```bash
# Start local node
pnpm node

# Deploy to localhost
pnpm deploy:local

# Deploy to Sepolia testnet
pnpm deploy:sepolia

# Clean generated files
pnpm clean
```

### Contract Testing
```bash
cd Backend
npx hardhat test
```

## Frontend Development

The frontend is built with:
- Next.js 14 (App Router)
- RainbowKit for wallet connection
- Wagmi for Ethereum interactions
- TypeScript for type safety
- Tailwind CSS for styling

### Available Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## MetaMask Configuration

To interact with locally deployed contracts:

1. Add Hardhat network to MetaMask:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import a test account:
   - Get the private key from Hardhat's default accounts
   - First account private key:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   This account comes with 10,000 test ETH.

## Deployment

### Smart Contract
- For testnet deployment:
  ```bash
  cd Backend
  pnpm deploy:sepolia
  ```
  Ensure you have sufficient Sepolia ETH and correct environment variables.

### Frontend
The frontend can be deployed to Vercel:
1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables if needed
4. Deploy

## Troubleshooting

### Backend Issues
1. **Node Already Running**:
   - Error: `listen EADDRINUSE: address already in use 127.0.0.1:8545`
   - Solution: Kill the existing node process or use it

2. **Deployment Fails**:
   - Check if local node is running (for localhost)
   - Verify `.env` configuration (for Sepolia)
   - Ensure sufficient testnet ETH

### Frontend Issues
1. **Contract Interaction Fails**:
   - Verify wallet is connected
   - Check if correct network is selected
   - Ensure contract address and ABI are updated

2. **MetaMask Connection**:
   - Reset account if changing networks
   - Switch networks and back if state is stale

## Security Considerations

- Never commit `.env` files
- Keep private keys secure
- Use different accounts for development and production
- Audit contracts before mainnet deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
