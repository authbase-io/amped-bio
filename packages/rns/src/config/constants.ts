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
export const DEFAULT_NETWORK = 'revo';

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
