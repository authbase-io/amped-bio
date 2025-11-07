import { useEffect } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";
import { useConnect } from "wagmi";

export function useWeb3AuthWagmi() {
  const { web3Auth, userInfo, provider, isConnected: web3AuthConnected } = useWeb3Auth();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // When Web3Auth connects, ensure wagmi is also connected
    if (web3AuthConnected && provider && web3Auth) {
      // Find the web3auth connector
      const web3AuthConnector = connectors.find(c => c.id === 'web3auth');

      if (web3AuthConnector) {
        // Set the provider on window for the connector to use
        (window as any).web3authProvider = provider;

        // Connect wagmi with the web3auth connector
        connect({ connector: web3AuthConnector });
      }
    }
  }, [web3AuthConnected, provider, web3Auth, connect, connectors]);

  return {
    web3Auth,
    userInfo,
    provider,
    isConnected: web3AuthConnected,
  };
}