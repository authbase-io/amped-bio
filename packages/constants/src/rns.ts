/**
 * RNS (Revolution Name Service) Constants
 * Contract addresses and configuration for RNS on Revolution chains
 */

export const RNS_CONTRACTS = {
  // Base Sepolia (Chain ID: 84532)
  baseSepolia: {
    chainId: 84532,
    chainName: 'Base Sepolia',
    registrarController: '0x8668a395f9052C17876bF9f1D304c2Bb577d23F4',
    resolver: '0xdfb55ba174810F2aA9CcAd8047456b1EF3b5109a',
    baseRegistrar: '0x722aAc5CC12be68FB05CE93997B705e7Ca9d4cfc',
    reverseRegistrar: '0xD90d3bF34804af3AE7D33a232b8Ffd9BF1439d34',
    subgraphUrl: 'https://api.studio.thegraph.com/query/107114/base-revo-subgraph/version/latest',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
  // Libertas Testnet (Chain ID: 73863)
  libertasTestnet: {
    chainId: 73863,
    chainName: 'Libertas Testnet',
    registrarController: '0x6976f68f9d363962f2e70484a5ACC94Bacb8b671',
    resolver: '0x9E86dB3c2b644EC19e8dA6Ad21D04B7Af38C3707',
    baseRegistrar: '0x6fb4834326a955949A6447F0f0a01333d729C213',
    reverseRegistrar: '0xcEa357DD5F29e574DDe8bB658B1A02b97512F879',
    subgraphUrl: 'https://graph.libertas.revolutionchain.io/subgraphs/name/example/test-subgraph',
    blockExplorerUrl: 'https://libertas.revoscan.io',
  },
  // Revolution Devnet (Chain ID: 73861)
  revolutionDevnet: {
    chainId: 73861,
    chainName: 'Revolution Devnet',
    registrarController: '0x6976f68f9d363962f2e70484a5ACC94Bacb8b671', // Update if different
    resolver: '0x9E86dB3c2b644EC19e8dA6Ad21D04B7Af38C3707',
    baseRegistrar: '0x6fb4834326a955949A6447F0f0a01333d729C213',
    reverseRegistrar: '0xcEa357DD5F29e574DDe8bB658B1A02b97512F879',
    subgraphUrl: 'https://graph.dev.revolutionchain.io/subgraphs/name/example/test-subgraph', // Update if different
    blockExplorerUrl: 'https://dev.revoscan.io',
  },
} as const;

export const RNS_CONFIG = {
  domainSuffix: '.revotest.eth',
  nameRequirements: {
    minLength: 3,
    maxLength: 64,
    validCharacters: /^[a-z0-9-]+$/,
  },
  gracePeriod: 3600, // seconds
  registrationDurations: {
    '1_year': 31536000,
    '2_years': 63072000,
    '3_years': 94608000,
    '5_years': 157680000,
  },
  priceFeeds: {
    etherscan: 'https://api.etherscan.io/v2/api?chainid=1&module=stats&action=ethprice&apikey=',
  },
  gateway: {
    url: 'https://api.dev.namesonchain.io',
  },
} as const;

/**
 * Get RNS contract addresses for a specific chain ID
 */
export function getRNSContracts(chainId: number) {
  switch (chainId) {
    case 84532:
      return RNS_CONTRACTS.baseSepolia;
    case 73863:
      return RNS_CONTRACTS.libertasTestnet;
    case 73861:
      return RNS_CONTRACTS.revolutionDevnet;
    default:
      return null;
  }
}

/**
 * Check if RNS is supported on a chain
 */
export function isRNSSupported(chainId: number): boolean {
  return chainId === 84532 || chainId === 73863 || chainId === 73861;
}
