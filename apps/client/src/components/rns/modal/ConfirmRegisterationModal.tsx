import React, { useEffect, useState } from "react";
import { X, Wallet } from "lucide-react";
import { Duration } from "luxon";
import { trimmedDomainName } from "@/utils/rns";
import { useRegistration } from "@/hooks/rns/useRegistration";
import { useAccount } from "wagmi";
import { useRNSNavigation } from "@/contexts/RNSNavigationContext";
import { toast } from "react-hot-toast";

interface ConfirmRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  duration: number;
  registrationPrice: string;
  ethPrice: string;
}

const ConfirmRegistrationModal = ({
  isOpen,
  onClose,
  name,
  duration,
  registrationPrice,
  ethPrice,
}: ConfirmRegistrationModalProps) => {
  const { navigateToSuccess } = useRNSNavigation();
  const { register } = useRegistration();
  const { isConnected } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTxSent, setIsTxSent] = useState(false);

  useEffect(() => {
    if (!isTxSent) return;

    const data = {
      name,
      duration,
      registrationPrice,
      usdPrice: (Number(registrationPrice) * Number(ethPrice)).toFixed(2),
      timestamp: Date.now(),
    };

    localStorage.setItem("transactionData", JSON.stringify(data));
  }, [isTxSent, name, duration, registrationPrice, ethPrice]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setIsTxSent(true);

      await register(name, BigInt(duration), registrationPrice);

      navigateToSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
      setIsTxSent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0 hours";

    const d = Duration.fromObject({ seconds });

    if (d.as("days") < 1) return d.shiftTo("hours").toHuman();
    if (d.as("weeks") < 1) return d.shiftTo("days").toHuman();
    if (d.as("months") < 1) return d.shiftTo("weeks").toHuman();
    if (d.as("years") < 1) return d.shiftTo("months").toHuman();
    return d.shiftTo("years").toHuman();
  };

  return (
    <div className="fixed inset-0 bg-black/[0.03] backdrop-blur-[8px] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-[448px] shadow-lg">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-[22px] font-semibold text-gray-900">
              {isTxSent ? "Transaction Sent" : "Confirm Details"}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {isTxSent ? (
            <>
              <p className="text-center text-gray-600">
                Your transaction has been submitted. You can safely close this modal.
              </p>

              <div className="space-y-2">
                <Detail label="Name" value={trimmedDomainName(name)} />
                <Detail label="Action" value="Register Name" />
                <Detail label="Duration" value={formatDuration(duration)} />
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <Wallet className="w-12 h-12 text-blue-500" />
                <p className="text-gray-600 text-center">
                  Double check these details before confirming in your wallet.
                </p>
              </div>

              <div className="space-y-2">
                <Detail label="Name" value={trimmedDomainName(name)} />
                <Detail label="Action" value="Register Name" />
                <Detail label="Duration" value={formatDuration(duration)} />
              </div>

              {isConnected && (
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Confirm Transaction
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-2xl p-4 flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900 truncate max-w-[60%]">{value}</span>
  </div>
);

export default ConfirmRegistrationModal;
