interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (accounts: string[]) => void) => void;
    removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    selectedAddress: string | null;
    chainId: string;
    networkVersion: string;
  };
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ALCHEMY_RPC_URL?: string;
    NEXT_PUBLIC_CONTRACT_ADDRESS?: string;
    ALCHEMY_API_KEY?: string;
    PRIVATE_KEY?: string;
    ETHERSCAN_API_KEY?: string;
  }
}