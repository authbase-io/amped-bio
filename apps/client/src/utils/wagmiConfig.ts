import { http, createConfig, createConnector } from "wagmi";
import { AVAILABLE_CHAINS, revolutionDevnet, libertasTestnet, baseSepoliaWithRNS } from "@ampedbio/web3";

// Custom connector for Web3Auth that uses Web3Auth's provider
function web3AuthConnector() {
  return createConnector((config) => ({
    id: "web3auth",
    name: "Web3Auth",
    type: "web3auth",

    async connect() {
      // Wait for Web3Auth provider to be available
      let attempts = 0;
      while (!((window as any).web3authProvider) && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      const provider = (window as any).web3authProvider;

      if (!provider) {
        throw new Error("Web3Auth not initialized. Please login with social account first.");
      }

      try {
        const accounts = await provider.request({
          method: "eth_accounts"
        }) as string[];

        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found");
        }

        const chainId = await provider.request({
          method: "eth_chainId"
        }) as string;

        console.log("Connected to Web3Auth embedded wallet:", accounts[0]);

        return {
          accounts: accounts as `0x${string}`[],
          chainId: parseInt(chainId, 16),
        };
      } catch (error) {
        console.error("Error connecting to Web3Auth:", error);
        throw error;
      }
    },

    async disconnect() {
      // Handled by Web3Auth
    },

    async getAccounts() {
      const provider = (window as any).web3authProvider;
      if (!provider) return [];

      try {
        const accounts = await provider.request({
          method: "eth_accounts"
        }) as string[];
        return accounts as `0x${string}`[];
      } catch {
        return [];
      }
    },

    async getChainId() {
      const provider = (window as any).web3authProvider;
      if (!provider) return config.chains[0]?.id || 84532;

      try {
        const chainId = await provider.request({
          method: "eth_chainId"
        }) as string;
        return parseInt(chainId, 16);
      } catch {
        return config.chains[0]?.id || 84532;
      }
    },

    async getProvider() {
      return (window as any).web3authProvider;
    },

    async isAuthorized() {
      const provider = (window as any).web3authProvider;
      return !!provider;
    },

    async switchChain({ chainId }) {
      const provider = (window as any).web3authProvider;
      if (!provider) {
        throw new Error("No provider available");
      }

      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) {
        throw new Error(`Chain ${chainId} not configured`);
      }

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return chain;
      } catch (error: any) {
        if (error.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls.default.http,
              blockExplorerUrls: chain.blockExplorers?.default.url ? [chain.blockExplorers.default.url] : undefined,
            }],
          });
          return chain;
        }
        throw error;
      }
    },

    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},
  }));
}

export const wagmiConfig = createConfig({
  chains: AVAILABLE_CHAINS,
  connectors: [
    web3AuthConnector(),
  ],
  transports: {
    [revolutionDevnet.id]: http(),
    [libertasTestnet.id]: http(),
    [baseSepoliaWithRNS.id]: http(),
  },
});
