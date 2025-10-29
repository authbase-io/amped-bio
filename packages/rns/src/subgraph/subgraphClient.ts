import { GraphQLClient } from "graphql-request";
import { useNetwork } from "../hooks/useNetwork";
import { useMemo } from "react";

// For non-hook contexts (direct function calls)
export function createSubgraphClient(subgraphUrl: string | undefined): GraphQLClient | null {
  if (!subgraphUrl) {
    console.warn("Subgraph URL is undefined for current network");
    return null;
  }
  return new GraphQLClient(subgraphUrl);
}

// Hook for React components
export function useSubgraphClient() {
  const { networkConfig } = useNetwork();

  const client = useMemo(() => {
    if (!networkConfig?.subgraphUrl) {
      console.warn(`No subgraph URL configured for network: ${networkConfig?.name}`);
      return null;
    }
    return new GraphQLClient(networkConfig.subgraphUrl);
  }, [networkConfig]);

  return client;
}

// Legacy export for backward compatibility
export const subgraphClient = null;