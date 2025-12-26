import React from "react";
import { X } from "lucide-react";
import { TxStatus } from "@/types/rns/common";

interface TransactionProgressModalProps {
  onClose: () => void;
  overallStatus: TxStatus; // "pending" | "success" | "error" | "idle"
  embedded?: boolean;
  txStatuses: Record<string, TxStatus>;
}

const TransactionProgressModal: React.FC<TransactionProgressModalProps> = ({
  onClose,
  overallStatus,
  embedded = false,
  txStatuses,
}) => {
  const renderStatusIcon = (status: TxStatus) => {
    switch (status) {
      case "pending":
        return (
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        );
      case "success":
        return (
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6667 3.5L5.25 9.91667L2.33333 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          </div>
        );
    }
  };

  const transactionItems = [
    { id: "setAddr", label: "Address record" },
    { id: "setName", label: "Name record" },
    { id: "reclaim", label: "Profile editing" },
    { id: "transfer", label: "Token ownership" },
  ];

  const content = (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Processing transactions</h2>
        {overallStatus !== "pending" && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800">
          We’re processing the required on-chain steps. This may take a few moments—please don’t
          close this window.
        </p>
      </div>

      <div className="space-y-4">
        {transactionItems.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-3">
            {renderStatusIcon(txStatuses[id])}
            <span className="text-lg">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">{content}</div>
    </div>
  );
};

export default TransactionProgressModal;
