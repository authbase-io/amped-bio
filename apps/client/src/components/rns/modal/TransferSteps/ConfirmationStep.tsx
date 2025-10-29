import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import {AddressResult, TransferTxn} from '@/types/rns/common';
import { scannerURL, trimmedDomainName } from '@/utils';

interface ConfirmationStepProps {
    onClose: () => void;
    ensName?: string;
    selectedAddress: AddressResult | null;
    transactions: TransferTxn;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
                                                               onClose,
                                                               ensName,
                                                               selectedAddress,
                                                               transactions
                                                           }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl font-semibold">Transfer complete</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5"/>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"/>
                    </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-2">
                    {trimmedDomainName(ensName || '')} has been transferred
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                    The domain has been successfully transferred to {selectedAddress?.name || selectedAddress?.address}.
                </p>

                {transactions?.transferTx && (
                    <a
                        href={scannerURL('tx', `${transactions.transferTx}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center text-blue-500 hover:underline"
                    >
                        View transaction
                        <ExternalLink className="w-4 h-4 ml-1"/>
                    </a>
                )}
                </div>
            </div>

            <div className="p-4 sm:p-6 border-t bg-white mt-auto">
                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
