import { useAccount } from "wagmi";
import { useWalletContext } from "@/contexts/WalletContext";

interface CustomClass {
    className?: string;
}

const CustomWalletButton: React.FC<CustomClass> = ({className = ''}) => {
  const { address } = useAccount();
  const { connect, connecting } = useWalletContext();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={() => !address && connect()}
      disabled={connecting}
      className={`px-4 py-2 font-medium rounded-2xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {connecting ? "Connecting..." : address ? formatAddress(address) : "Connect Wallet"}
    </button>
  );
};

export default CustomWalletButton;
