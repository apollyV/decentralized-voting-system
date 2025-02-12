'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { contractAbi, contractAddress } from '@/constants';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [number, setNumber] = useState<number | null>(null);

  const { data: numberGet, isPending: getIsPending, refetch } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'retrieve'
  })

  const { data: hash, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess, refetch])

  const setTheNumber = async() => {
    if (number === null) return
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'store',
      args: [BigInt(number)]
    })
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-8">
          <ConnectButton />
        </div>
        
        {isConnected ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/20">
            <h1 className="text-2xl font-bold mb-6 text-center">Simple Storage DApp</h1>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                {getIsPending ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Current Number in Blockchain</p>
                    <span className="text-3xl font-bold">{numberGet?.toString()}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <input 
                  type="number" 
                  onChange={(e) => setNumber(Number(e.target.value))} 
                  value={number ?? ''} 
                  placeholder="Enter a new number" 
                  disabled={isConfirming}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-200/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                
                <button 
                  onClick={setTheNumber} 
                  disabled={isConfirming}
                  className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {isConfirming ? 'Confirming...' : 'Update Number'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold mb-4">Welcome to Simple Storage DApp</h2>
            <p className="text-gray-400">Please connect your wallet to interact with the blockchain.</p>
          </div>
        )}
      </div>
    </main>
  )
}
