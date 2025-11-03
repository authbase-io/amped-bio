import { Duration } from '../types/common';

export type NetworkConfig = {
  id: string | number;
  name: string;
  registrarAddress: string;
  resolverAddress: string;
  baseAddress: string;
  reverseRegistrarAddress: string;
  rpcUrl: string;
  subgraphUrl: string;
  blockExplorerUrl?: string;
  blockExplorerName?: string;
};

export const NETWORKS: Record<string, NetworkConfig> = {
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    registrarAddress: '0x8668a395f9052C17876bF9f1D304c2Bb577d23F4',
    resolverAddress: '0xdfb55ba174810F2aA9CcAd8047456b1EF3b5109a',
    baseAddress: '0x722aAc5CC12be68FB05CE93997B705e7Ca9d4cfc',
    reverseRegistrarAddress: '0xD90d3bF34804af3AE7D33a232b8Ffd9BF1439d34',
    rpcUrl: 'https://sepolia.base.org',
    subgraphUrl: 'https://api.studio.thegraph.com/query/107114/base-revo-subgraph/version/latest',
    blockExplorerUrl: 'https://sepolia.basescan.org',
    blockExplorerName: 'BaseScan'
  },
  revo: {
    id: 73863,
    name: 'Revo',
    registrarAddress: '',
    resolverAddress: '',
    baseAddress: '',
    reverseRegistrarAddress: '',
    rpcUrl: 'https://libertas.revolutionchain.io/',
    subgraphUrl: '',
    blockExplorerUrl: '',
    blockExplorerName: 'Revo Explorer'
  }
} as const;

// Default network
export const DEFAULT_NETWORK = 'baseSepolia';

export const NAME_REQUIREMENTS = {
  minLength: 3,
  maxLength: 64,
  validCharacters: /^[a-z0-9-]+$/,
};

export const GRACE_PERIOD: number = 3600;

export const REGISTRATION_DURATIONS: Record<Duration, number> = {
  '1_year': 31536000,
  '2_years': 63072000,
  '3_years': 94608000,
  '5_years': 157680000,
};

export const DOMAIN_SUFFIX = '.revotest.eth';

// Optional price feed URL - can be configured by consuming app
export const PRICE_FEED_URL: string | undefined = undefined;
