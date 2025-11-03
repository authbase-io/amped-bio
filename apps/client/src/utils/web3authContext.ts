import {
  type WEB3AUTH_NETWORK_TYPE,
  type Web3AuthOptions,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK
} from "@web3auth/modal";

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

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  enableLogging: true,
  web3AuthNetwork: web3AuthNetwork || WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: defaultChainId || "0x14A34", // 84532 in hex for Base Sepolia
    rpcTarget: "https://sepolia.base.org",
    displayName: "Base Sepolia",
    blockExplorerUrl: "https://sepolia.basescan.org",
    ticker: "ETH",
    tickerName: "Sepolia ETH",
    logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4", // Base logo
  },
  // Disable wallet services plugin as it doesn't support custom chains well
  disableWalletServices: true,
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
  privateKeyProvider: undefined,
};

const web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
