import React from 'react';
import {Link} from 'react-router-dom'
import {useAccount, useChainId} from "wagmi";
import { useWalletContext } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

const Header = () => {
    const {address: ownerAddress} = useAccount();
    const { connect, connecting, balance } = useWalletContext();
    const chainId = useChainId();

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getChainName = (id: number) => {
        switch(id) {
            case 73863: return "Libertas";
            case 73861: return "Devnet";
            default: return "Unknown";
        }
    };

    return (
        <header className="relative w-full z-50 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-blue-600">Revolution Names</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {ownerAddress && (
                            <Link to="/my-domains"
                                  className="text-gray-700 hover:text-gray-900 px-4 py-2 text-base font-medium transition-colors">
                                My Names
                            </Link>
                        )}
                        {ownerAddress ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-500">{getChainName(chainId)}</span>
                                    <span className="text-sm font-medium">{formatAddress(ownerAddress)}</span>
                                </div>
                                {balance?.data && (
                                    <span className="text-sm text-gray-600 ml-2">
                                        {parseFloat(balance.data.formatted).toFixed(4)} {balance.data.symbol}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={connect}
                                disabled={connecting}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Wallet className="w-4 h-4" />
                                {connecting ? "Connecting..." : "Connect Wallet"}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {ownerAddress && (
                            <Link to="/my-domains"
                                  className="text-gray-700 hover:text-gray-900 px-3 py-1.5 text-sm font-medium transition-colors">
                                My Names
                            </Link>
                        )}
                        {ownerAddress ? (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                                <span className="text-xs font-medium">{formatAddress(ownerAddress)}</span>
                            </div>
                        ) : (
                            <button
                                onClick={connect}
                                disabled={connecting}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                <Wallet className="w-3 h-3" />
                                {connecting ? "..." : "Connect"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;
