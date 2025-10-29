import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { AddressResult } from '@/types/rns/common';
import { NameDetails } from "@/types/rns/name";
import {trimmedDomainName} from "@/utils/rns";

interface FormStepProps {
    onClose: () => void;
    goBack: () => void;
    ensName?: string;
    nameDetails: NameDetails;
    selectedAddress: AddressResult | null;
    isConnected: boolean;
    overallStatus: string;
    handleTransfer: () => void;
    nameError: string | null;
}

const FormStep: React.FC<FormStepProps> = ({
                                               onClose,
                                               goBack,
                                               ensName,
                                               nameDetails,
                                               selectedAddress,
                                               isConnected,
                                               overallStatus,
                                               handleTransfer,
                                               nameError
                                           }) => {
    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                <button onClick={goBack} className="text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button onClick={onClose} className="text-gray-500">
                    <X className="w-6 h-6"/>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">You&#39;ll be sending</h1>

            <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden"/>
                    <div>
                        <p className="font-semibold">{trimmedDomainName(ensName as string)}</p>
                        <p className="block lg:hidden text-gray-500 text-sm">{nameDetails.displayAddress || '0x...'}</p>
                        <p className="hidden lg:block text-gray-500 text-sm">{nameDetails.ownerAddress || '0x...'}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-2">To</h2>

            <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden"/>
                    <div>
                        {selectedAddress?.name && <p className="font-medium">{selectedAddress.name}</p>}
                        <>
                            <p className={`block lg:hidden text-sm ${selectedAddress?.name ? "text-gray-500" : "font-medium"}`}>
                                {selectedAddress?.address ? `${selectedAddress.address.slice(0, 6)}...${selectedAddress.address.slice(-4)}` : ''}
                            </p>
                            <p className={`hidden lg:block  text-sm ${selectedAddress?.name ? "text-gray-500" : "font-medium"}`}>
                                {selectedAddress?.address}
                            </p>
                        </>
                    </div>
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-2">What you&#39;ll send</h2>

            <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="space-y-2">
                    <div>
                        <p className="font-semibold text-sm">Address record</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Your Basename will resolve to this address.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Name record</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Your Basename will no longer be displayed with your address.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Profile editing</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Transfer editing rights to this address.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Token ownership</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Transfer the Basename token to this address.</p>
                    </div>
                </div>
            </div>

            {nameError && (
                <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5"/>
                        <span className="font-medium">Error</span>
                    </div>
                    <p className="mt-1">{nameError}</p>
                </div>
            )}
            </div>

            <div className="p-4 sm:p-6 border-t bg-white flex-shrink-0">
                <button
                    onClick={handleTransfer}
                    disabled={!isConnected || overallStatus === 'pending'}
                    className="w-full bg-blue-500 text-white py-2.5 px-6 rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default FormStep;
