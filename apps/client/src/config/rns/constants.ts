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
    registrarAddress: '0x6976f68f9d363962f2e70484a5ACC94Bacb8b671',
    resolverAddress: '0x9E86dB3c2b644EC19e8dA6Ad21D04B7Af38C3707',
    baseAddress: '0x6fb4834326a955949A6447F0f0a01333d729C213',
    reverseRegistrarAddress: '0xcEa357DD5F29e574DDe8bB658B1A02b97512F879',
    rpcUrl: 'https://libertas.revolutionchain.io/',
    subgraphUrl: 'https://graph.libertas.revolutionchain.io/subgraphs/name/example/test-subgraph',
    blockExplorerUrl: 'https://libertas.revoscan.io',
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

// Price feed URL for ETH price
export const PRICE_FEED_URL = 'https://api.etherscan.io/v2/api?chainid=1&module=stats&action=ethprice&apikey=QA295ZRJC6PBDTMXIZWIY6999R3VFYBIZP';

// Gateway URL for name resolution
export const GATEWAY_URL = 'https://api.dev.namesonchain.io';
