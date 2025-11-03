import { chainConfig } from "viem/zksync";
import { baseSepolia } from "viem/chains";

export const revolutionDevnet = {
  ...chainConfig,
  id: 73861,
  name: "Revochain Devnet",
  network: "revochain-devnet",
  nativeCurrency: {
    name: "Revochain Devnet",
    symbol: "dREVO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://dev.revolutionchain.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Revochain Testnet Explorer",
      url: "https://dev.revoscan.io",
      apiUrl: "https://api.dev.revoscan.io",
    },
  },
  testnet: true,
  // RNS Contract Addresses
  contracts: {
    rns: {
      registrarController: "0x6976f68f9d363962f2e70484a5ACC94Bacb8b671" as `0x${string}`,
      resolver: "0x9E86dB3c2b644EC19e8dA6Ad21D04B7Af38C3707" as `0x${string}`,
      baseRegistrar: "0x6fb4834326a955949A6447F0f0a01333d729C213" as `0x${string}`,
      reverseRegistrar: "0xcEa357DD5F29e574DDe8bB658B1A02b97512F879" as `0x${string}`,
    },
  },
} as const;

export const libertasTestnet = {
  ...chainConfig,
  id: 73863,
  name: "Libertas Testnet",
  network: "libertas-testnet",
  nativeCurrency: {
    name: "Libertas Testnet",
    symbol: "tREVO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://libertas.revolutionchain.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Libertas Testnet Explorer",
      url: "https://libertas.revoscan.io",
      apiUrl: "https://api.libertas.revoscan.io",
    },
  },
  testnet: true,
  // RNS Contract Addresses
  contracts: {
    rns: {
      registrarController: "0x6976f68f9d363962f2e70484a5ACC94Bacb8b671" as `0x${string}`,
      resolver: "0x9E86dB3c2b644EC19e8dA6Ad21D04B7Af38C3707" as `0x${string}`,
      baseRegistrar: "0x6fb4834326a955949A6447F0f0a01333d729C213" as `0x${string}`,
      reverseRegistrar: "0xcEa357DD5F29e574DDe8bB658B1A02b97512F879" as `0x${string}`,
    },
  },
} as const;

// Base Sepolia configuration with RNS contracts
export const baseSepoliaWithRNS = {
  ...baseSepolia,
  // RNS Contract Addresses for Base Sepolia (from revolution-names .env)
  contracts: {
    ...baseSepolia.contracts,
    rns: {
      registrarController: "0x8668a395f9052C17876bF9f1D304c2Bb577d23F4" as `0x${string}`,
      resolver: "0xdfb55ba174810F2aA9CcAd8047456b1EF3b5109a" as `0x${string}`,
      baseRegistrar: "0x722aAc5CC12be68FB05CE93997B705e7Ca9d4cfc" as `0x${string}`,
      reverseRegistrar: "0xD90d3bF34804af3AE7D33a232b8Ffd9BF1439d34" as `0x${string}`,
    },
  },
} as const;

export const AVAILABLE_CHAINS = [baseSepoliaWithRNS, libertasTestnet, revolutionDevnet] as const;

export const getChainConfig = (chainId: number) => {
  const chain = AVAILABLE_CHAINS.find(c => c.id === chainId);
  return chain ? { ...chain } : null;
};

export const getCurrencySymbol = (chainId: number) => {
  const chain = getChainConfig(chainId);
  return chain ? chain.nativeCurrency.symbol : "REVO";
};
