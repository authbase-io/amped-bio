import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';

interface VerificationBadgeProps {
  className?: string;
}

const VerificationBadge = ({ className = '' }: VerificationBadgeProps) => {
  const { address, isConnected } = useAccount();

  const handleVerificationClick = () => {
    // Redirect to authbase.io for verification
    const authbaseUrl = 'https://app.authbase.io';
    
    window.open(authbaseUrl, '_blank', 'noopener,noreferrer');
  };

  // Not connected
  if (!isConnected || !address) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 ${className}`}>
        <Shield className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">Connect Wallet</span>
      </div>
    );
  }

  // Show verify button that redirects to authbase.io
  return (
    <button
      onClick={handleVerificationClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
      title="Verify on Authbase"
    >
      <Shield className="w-4 h-4 text-gray-600 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-none">
        <span className="hidden sm:inline">Verify Identity</span>
        <span className="sm:hidden">Verify</span>
      </span>
      <ExternalLink className="w-3 h-3 text-gray-500 flex-shrink-0" />
    </button>
  );
};

export default VerificationBadge;
