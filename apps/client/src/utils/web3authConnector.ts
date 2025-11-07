import { createConnector } from "wagmi";
import type { Web3Auth } from "@web3auth/modal";
import type { IProvider } from "@web3auth/base";

export interface Web3AuthConnectorOptions {
  web3AuthInstance: Web3Auth;
}

// Custom connector for Web3Auth
export function web3AuthConnector(options: Web3AuthConnectorOptions) {
  const { web3AuthInstance } = options;

  return createConnector((config) => ({
    id: "web3auth",
    name: "Web3Auth",
    type: "web3auth",

    async connect() {
      try {
        // Check if already connected
        if (!web3AuthInstance.connected) {
          await web3AuthInstance.connect();
        }

        const provider = web3AuthInstance.provider;
        if (!provider) {
          throw new Error("No Web3Auth provider found");
        }

        // Get account from provider
        const accounts = await provider.request({
          method: "eth_accounts"
        }) as string[];

        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found");
        }

        // Get chain ID
        const chainId = await provider.request({
          method: "eth_chainId"
        }) as string;

        return {
          accounts: accounts as `0x${string}`[],
          chainId: parseInt(chainId, 16),
        };
      } catch (error) {
        console.error("Error connecting with Web3Auth:", error);
        throw error;
      }
    },

    async disconnect() {
      try {
        await web3AuthInstance.logout();
      } catch (error) {
        console.error("Error disconnecting Web3Auth:", error);
      }
    },

    async getAccounts() {
      if (!web3AuthInstance.connected || !web3AuthInstance.provider) {
        return [];
      }

      try {
        const accounts = await web3AuthInstance.provider.request({
          method: "eth_accounts"
        }) as string[];

        return accounts as `0x${string}`[];
      } catch (error) {
        console.error("Error getting accounts:", error);
        return [];
      }
    },

    async getChainId() {
      if (!web3AuthInstance.connected || !web3AuthInstance.provider) {
        return config.chains[0]?.id || 1;
      }

      try {
        const chainId = await web3AuthInstance.provider.request({
          method: "eth_chainId"
        }) as string;

        return parseInt(chainId, 16);
      } catch (error) {
        console.error("Error getting chain ID:", error);
        return config.chains[0]?.id || 1;
      }
    },

    async getProvider() {
      return web3AuthInstance.provider as IProvider;
    },

    async isAuthorized() {
      try {
        return web3AuthInstance.connected;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      if (!web3AuthInstance.provider) {
        throw new Error("No provider available");
      }

      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) {
        throw new Error(`Chain ${chainId} not configured`);
      }

      try {
        await web3AuthInstance.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });

        return chain;
      } catch (error: any) {
        // If chain doesn't exist, try to add it
        if (error.code === 4902) {
          await web3AuthInstance.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default.http,
                blockExplorerUrls: chain.blockExplorers?.default.url ? [chain.blockExplorers.default.url] : undefined,
              },
            ],
          });

          return chain;
        }

        throw error;
      }
    },

    onAccountsChanged(accounts) {
      // Not needed as Web3Auth manages this
    },

    onChainChanged(chain) {
      // Not needed as Web3Auth manages this
    },

    onDisconnect() {
      // Not needed as Web3Auth manages this
    },
  }));
}