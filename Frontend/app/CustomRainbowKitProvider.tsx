'use client'
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from './config';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

const CustomRainbowKitProvider = ({ children }: Props) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}
export default CustomRainbowKitProvider
