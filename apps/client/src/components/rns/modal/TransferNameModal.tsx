import React, { useEffect, useState } from "react";
import { useTransferOwnership } from "@/hooks/rns/useTransferOwnership";
import { useNameDetails } from "@/hooks/rns/useNameDetails";
import { useAccount } from "wagmi";
import SearchStep from "./TransferSteps/SearchStep";
import FormStep from "./TransferSteps/FormStep";
import { WarningModal } from "./TransferSteps/WarningModal";
import TransactionProgressModal from "./TransferSteps/TransactionProgressStep";
import ConfirmationStep from "./TransferSteps/ConfirmationStep";
import { AddressResult } from "@/types/rns/common";

interface TransferNameModalProps {
  onClose: () => void;
  ensName?: string;
  expiryDate?: string;
}

const TransferNameModal: React.FC<TransferNameModalProps> = ({ onClose, ensName = "" }) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const { transferOwnership, isConnected, overallStatus, transactions, txStatuses } =
    useTransferOwnership();

  const { address } = useAccount();

  const domainName = ensName?.split(".")[0] || "";
  const { ownerAddress, displayAddress, nftId } = useNameDetails(domainName);

  /**
   * Auto move to confirmation on success
   */
  useEffect(() => {
    if (step === 4 && overallStatus === "success") {
      setStep(5);
    }
  }, [overallStatus, step]);

  const handleContinue = () => {
    if (!selectedAddress) return;

    if (ownerAddress && ownerAddress.toLowerCase() !== address?.toLowerCase()) {
      setNameError("You don't have permission to transfer this name.");
      return;
    }

    setNameError(null);
    setStep(2);
  };

  const handleTransfer = () => {
    if (!selectedAddress || !ensName) return;
    setStep(3);
  };

  const handleWarningConfirm = async () => {
    setStep(4);

    try {
      if (!selectedAddress || !address || !nftId) return;

      await transferOwnership(domainName, selectedAddress.address as `0x${string}`);
    } catch (error) {
      console.error("Transfer error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-lg flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {step === 1 && (
          <SearchStep
            onClose={onClose}
            recipient={recipient}
            setRecipient={setRecipient}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            isValidatingAddress={isValidatingAddress}
            setIsValidatingAddress={setIsValidatingAddress}
            ensName={ensName}
            // nameDetails={nameDetails as unknown as string}
            ownerAddress={ownerAddress}
            address={address}
            isConnected={isConnected}
            handleContinue={handleContinue}
          />
        )}

        {step === 2 && (
          <FormStep
            onClose={onClose}
            goBack={() => setStep(1)}
            ensName={ensName}
            ownerAddress={ownerAddress}
            displayAddress={displayAddress}
            selectedAddress={selectedAddress}
            isConnected={isConnected}
            overallStatus={overallStatus}
            handleTransfer={handleTransfer}
            nameError={nameError}
          />
        )}

        {step === 3 && <WarningModal onClose={() => setStep(2)} onConfirm={handleWarningConfirm} />}

        {step === 4 && (
          <TransactionProgressModal
            onClose={onClose}
            overallStatus={overallStatus}
            embedded
            txStatuses={txStatuses}
          />
        )}

        {step === 5 && (
          <ConfirmationStep
            onClose={onClose}
            ensName={ensName}
            selectedAddress={selectedAddress}
            transactions={transactions}
          />
        )}
      </div>
    </div>
  );
};

export default TransferNameModal;
