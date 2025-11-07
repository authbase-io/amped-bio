import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const defaultChainId = import.meta.env.VITE_DEFAULT_NETWORK_ID_HEX;
const web3AuthNetwork = import.meta.env.VITE_WEB3AUTH_NETWORK;

// Chain configuration
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: defaultChainId || "0x14A34", // 84532 in hex for Base Sepolia
  rpcTarget: "https://sepolia.base.org",
  displayName: "Base Sepolia",
  blockExplorerUrl: "https://sepolia.basescan.org",
  ticker: "ETH",
  tickerName: "Sepolia ETH",
  logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
};

// Initialize Ethereum Private Key Provider for embedded wallet
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig }
});

// Create Web3Auth instance with No Modal approach
export const web3AuthNoModal = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: web3AuthNetwork || WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
  privateKeyProvider,
  enableLogging: true,
});

// Configure OpenLogin adapter for social logins only
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      appName: "Amped Bio",
      logoLight: "https://your-logo.com/logo-light.png",
      logoDark: "https://your-logo.com/logo-dark.png",
      defaultLanguage: "en",
      mode: "light",
      theme: {
        primary: "#768729",
      },
    },
    loginConfig: {
      google: {
        verifier: "google",
        typeOfLogin: "google",
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      },
    },
  },
  privateKeyProvider,
});

// Add only the OpenLogin adapter (no external wallets)
web3AuthNoModal.configureAdapter(openloginAdapter);

export const initializeWeb3Auth = async () => {
  try {
    await web3AuthNoModal.init();
    console.log("Web3Auth No-Modal initialized successfully");
    return web3AuthNoModal;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    throw error;
  }
};

export const loginWithSocial = async (loginProvider: string) => {
  try {
    if (!web3AuthNoModal.connected) {
      const web3authProvider = await web3AuthNoModal.connectTo(
        openloginAdapter.name,
        {
          loginProvider,
        }
      );
      console.log("Connected with provider:", web3authProvider);
      return web3authProvider;
    }
    return web3AuthNoModal.provider;
  } catch (error) {
    console.error("Error connecting:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await web3AuthNoModal.logout();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};