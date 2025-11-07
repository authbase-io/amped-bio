import {
  type WEB3AUTH_NETWORK_TYPE,
  type Web3AuthOptions,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  type ModalConfig
} from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const defaultChainId = import.meta.env.VITE_DEFAULT_NETWORK_ID_HEX;
const web3AuthNetwork = import.meta.env.VITE_WEB3AUTH_NETWORK as WEB3AUTH_NETWORK_TYPE;

console.info("Web3Auth Client ID:", clientId);
console.info("Web3Auth Default Chain ID:", defaultChainId);
console.info("Web3Auth Network:", web3AuthNetwork);

// Validate required environment variables
if (!clientId) {
  console.error("Missing VITE_WEB3AUTH_CLIENT_ID in environment variables");
}

// Chain configuration for Base Sepolia
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: defaultChainId || "0x14A34", // 84532 in hex for Base Sepolia
  rpcTarget: "https://sepolia.base.org",
  displayName: "Base Sepolia",
  blockExplorerUrl: "https://sepolia.basescan.org",
  ticker: "ETH",
  tickerName: "Sepolia ETH",
  logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4", // Base logo
};

// CRITICAL: Initialize Ethereum Private Key Provider for embedded wallet generation
// This ensures Web3Auth generates its own wallet, not using external wallets like MetaMask
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

// Modal configuration to disable external wallets
// Only show social login options, hide all external wallet adapters
const modalConfig: Record<string, ModalConfig> = {
  // Keep AUTH (social logins) enabled
  'auth': {
    label: 'auth',
    showOnModal: true,
  },
  // Disable ALL external wallet adapters
  'torus-evm': {
    label: 'torus-evm',
    showOnModal: false,
  },
  'metamask': {
    label: 'metamask',
    showOnModal: false,
  },
  'wallet-connect-v1': {
    label: 'wallet-connect-v1',
    showOnModal: false,
  },
  'wallet-connect-v2': {
    label: 'wallet-connect-v2',
    showOnModal: false,
  },
  'coinbase': {
    label: 'coinbase',
    showOnModal: false,
  },
  // For v9+, also disable default adapters
  'default-evm-adapter': {
    label: 'default-evm-adapter',
    showOnModal: false,
  },
  'default-solana-adapter': {
    label: 'default-solana-adapter',
    showOnModal: false,
  },
};

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  enableLogging: true,
  web3AuthNetwork: web3AuthNetwork || WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
  // IMPORTANT: Set the privateKeyProvider to enable embedded wallet generation
  privateKeyProvider,
  // Disable wallet services plugin as it doesn't support custom chains well
  disableWalletServices: true,
  // Modal configuration - disable ALL external wallets
  modalConfig,
  uiConfig: {
    appName: "Amped Bio",
    mode: "light",
    defaultLanguage: "en",
    loginMethodsOrder: ["google", "facebook", "twitter", "discord"],
    modalZIndex: "2147483647",
    // Add theme configuration for better UX
    theme: {
      primary: "#768729",
    },
  },
};

const web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
