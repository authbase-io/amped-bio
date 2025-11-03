import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { AVAILABLE_CHAINS, revolutionDevnet, libertasTestnet, baseSepoliaWithRNS } from "@ampedbio/web3";

export const wagmiConfig = createConfig({
  chains: AVAILABLE_CHAINS,
  connectors: [
    injected({
      target: () => ({
        id: 'web3auth',
        name: 'Web3Auth',
        provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
      }),
    }),
  ],
  transports: {
    [revolutionDevnet.id]: http(),
    [libertasTestnet.id]: http(),
    [baseSepoliaWithRNS.id]: http(),
  },
});
