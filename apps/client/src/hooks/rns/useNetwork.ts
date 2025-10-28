import { useCallback, useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { NETWORKS, DEFAULT_NETWORK, NetworkConfig } from '@/config/rns/constants';
import type { Chain } from 'viem';

const STORAGE_KEY = 'preferred_network';

export function useNetwork(): {
  selectedNetwork: string;
  currentChainId: number;
  networkConfig: NetworkConfig | null;
  supportedNetworks: Array<{ key: string; isActive: boolean; chainId: number } & NetworkConfig>;
  switchToNetwork: (networkKey: string) => Promise<void>;
  getNetworkConfig: (networkKey?: string) => NetworkConfig | null;
  isNetworkSupported: (chainId: number) => boolean;
  isSwitching: boolean;
  switchError: Error | null;
  availableChains: readonly [Chain, ...Chain[]];
} {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, chains, isPending: isSwitching, error: switchError } = useSwitchChain();

  // Get current network based on chainId
  const getCurrentNetwork = useCallback((): string => {
    const network = Object.entries(NETWORKS).find(([, config]) =>
      Number(config.id) === chainId
    );
    return network ? network[0] : DEFAULT_NETWORK;
  }, [chainId]);

  const [selectedNetwork, setSelectedNetwork] = useState<string>(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && NETWORKS[stored]) {
        return stored;
      }
    }
    return getCurrentNetwork();
  });

  // Update selected network when chain changes
  useEffect(() => {
    const currentNetwork = getCurrentNetwork();
    if (currentNetwork !== selectedNetwork && NETWORKS[currentNetwork]) {
      setSelectedNetwork(currentNetwork);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, currentNetwork);
      }
    }
  }, [chainId, getCurrentNetwork, selectedNetwork]);

  const switchToNetwork = useCallback(async (networkKey: string) => {
    if (!NETWORKS[networkKey]) {
      console.error(`Network ${networkKey} not found`);
      return;
    }

    const targetChainId = Number(NETWORKS[networkKey].id);

    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, networkKey);
    }
    setSelectedNetwork(networkKey);

    // If wallet is connected, switch chain
    if (isConnected && switchChain) {
      try {
        await switchChain({ chainId: targetChainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
        // Revert selection on error
        const currentNetwork = getCurrentNetwork();
        setSelectedNetwork(currentNetwork);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, currentNetwork);
        }
        throw error;
      }
    }
  }, [isConnected, switchChain, getCurrentNetwork]);

  const getNetworkConfig = useCallback((networkKey?: string): NetworkConfig | null => {
    const key = networkKey || selectedNetwork;
    return NETWORKS[key] || null;
  }, [selectedNetwork]);

  const isNetworkSupported = useCallback((chainId: number): boolean => {
    return Object.values(NETWORKS).some(config => Number(config.id) === chainId);
  }, []);

  const supportedNetworks = Object.entries(NETWORKS).map(([key, config]) => ({
    key,
    ...config,
    isActive: key === selectedNetwork,
    chainId: Number(config.id)
  }));

  return {
    selectedNetwork,
    currentChainId: chainId,
    networkConfig: getNetworkConfig(),
    supportedNetworks,
    switchToNetwork,
    getNetworkConfig,
    isNetworkSupported,
    isSwitching,
    switchError,
    availableChains: chains,
  };
}