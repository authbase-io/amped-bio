import "./index.css";
import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./utils/web3authContext.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/trpc/trpc.ts";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./utils/wagmiConfig.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";

// Get Google client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <Web3AuthProvider config={web3AuthContextConfig}>
          <App />
        </Web3AuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
