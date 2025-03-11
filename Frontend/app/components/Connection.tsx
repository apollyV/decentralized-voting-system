import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Connection() {
    const { address, isConnected } = useAccount();
    
    return (
        <div>
            <ConnectButton />
            {isConnected ? (
                <div>
                    Connecté
                </div>
            ) : (
                <div className="text-center mt-20">
                    <h2 className="text-xl font-semibold mb-4">
                        Bienvenue sur la DApp Governance
                    </h2>
                    <p className="text-gray-400">
                        Veuillez connecter votre portefeuille pour interagir avec la
                        blockchain.
                    </p>
                </div>
            )}
        </div>
    )
}