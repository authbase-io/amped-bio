export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: Error | null;
}

export type WalletAction =
    | { type: 'SET_CONNECTED'; payload: { address: string; chainId: number } }
    | { type: 'SET_DISCONNECTED' }
    | { type: 'SET_CONNECTING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error }
    | { type: 'SET_CHAIN_ID'; payload: number }
    | { type: 'RESET_STATE' };

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
}
