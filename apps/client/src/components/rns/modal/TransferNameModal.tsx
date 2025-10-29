import React, { useEffect, useState } from 'react';
import { useTransferOwnership } from "@/hooks/rns/useTransferOwnership";
import { useNameDetails } from '@/hooks/rns/useNameDetails';
import { useOwnerDetail } from '@/hooks/rns/useOwnerDetail';
import { useAccount } from 'wagmi';
import SearchStep from './TransferSteps/SearchStep';
import FormStep from './TransferSteps/FormStep';
import { WarningModal } from './TransferSteps/WarningModal';
import TransactionProgressModal from './TransferSteps/TransactionProgressStep';
import ConfirmationStep from './TransferSteps/ConfirmationStep';
import { AddressResult } from '@/types/rns/common';

interface TransferNameModalProps {
    onClose: () => void;
    ensName?: string;
    expiryDate?: string;
}

const TransferNameModal: React.FC<TransferNameModalProps> = ({
                                                                 onClose,
                                                                 ensName = ""
                                                             }) => {
    const [step, setStep] = useState(1);
    const [recipient, setRecipient] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
    const [isValidatingAddress, setIsValidatingAddress] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);

    const {
        transferOwnership,
        isConnected,
        txStatuses,
        transactions,
        overallStatus
    } = useTransferOwnership();

    const { address } = useAccount();

    // Get the owner details of the ENS name we're transferring
    const domainName = ensName?.split('.')[0] || '';
    const { details: nameDetails } = useNameDetails(domainName);
    const { ownerAddress = { full: '0x', formatted: '' }, nftId } = useOwnerDetail(domainName) as unknown as { ownerAddress: { full: `0x${string}`; formatted: string }, nftId: string, expiryDate: string };

    // Effect to handle transaction completion
    useEffect(() => {
        if (step === 4 && overallStatus === 'success') {
            setStep(5); // Move to confirmation step
        }
    }, [overallStatus, step]);

    const handleContinue = () => {
        if (selectedAddress) {
            // Validate that the name exists and user owns it
            if (!nameDetails) {
                setNameError("This name doesn't exist or couldn't be loaded.");
                return;
            }

            if (ownerAddress.full && ownerAddress.full.toLowerCase() !== address?.toLowerCase()) {
                setNameError("You don't have permission to transfer this name.");
                return;
            }

            setNameError(null);
            setStep(2);
        }
    };

    const handleTransfer = () => {
        if (!selectedAddress || !ensName) return;
        setStep(3); // Show warning step
    };

    const handleWarningConfirm = async () => {
        setStep(4); // Show transaction progress

        try {
            const domainName = ensName.split('.')[0];
            if (!selectedAddress || !address || !nftId) return;
            await transferOwnership(domainName, selectedAddress.address as `0x${string}`);
            // Step change will be handled by the useEffect that watches overallStatus
        } catch (error) {
            console.error('Transfer error:', error);
            // Handle error state
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-hidden flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] shadow-lg flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {step === 1 && (
                    <div className="flex flex-col h-full min-h-0">
                        <SearchStep
                        onClose={onClose}
                        recipient={recipient}
                        setRecipient={setRecipient}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        isValidatingAddress={isValidatingAddress}
                        setIsValidatingAddress={setIsValidatingAddress}
                        ensName={ensName}
                        nameDetails={nameDetails as unknown as string}
                        ownerAddress={ownerAddress}
                        address={address}
                        isConnected={isConnected}
                        handleContinue={handleContinue}
                    />
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col h-full min-h-0">
                        <FormStep
                        onClose={onClose}
                        goBack={() => setStep(1)}
                        ensName={ensName}
                        nameDetails={nameDetails}
                        selectedAddress={selectedAddress}
                        isConnected={isConnected}
                        overallStatus={overallStatus}
                        handleTransfer={handleTransfer}
                        nameError={nameError}
                    />
                    </div>
                )}

                {step === 3 && (
                    <div className="p-6">
                        <WarningModal
                            onClose={() => setStep(2)}
                            onConfirm={handleWarningConfirm}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="p-6">
                        <TransactionProgressModal
                            onClose={onClose}  // Allow closing with disabled state during transaction
                            txStatuses={txStatuses}
                            overallStatus={overallStatus}
                            embedded={true}
                        />
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col h-full min-h-0">
                        <ConfirmationStep
                        onClose={onClose}
                        ensName={ensName}
                        selectedAddress={selectedAddress}
                        transactions={transactions}
                    />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferNameModal;
