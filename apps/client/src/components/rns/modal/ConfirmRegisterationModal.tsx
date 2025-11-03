import React, { useState, useEffect } from 'react';
import { X, Wallet } from 'lucide-react';
import { Duration } from 'luxon';
import {trimmedDomainName} from "@/utils/rns";
import {useRegistration} from "@/hooks/rns/useRegistration";
import CustomWalletButton from '../ui/CustomConnectButton';
import { useAccount } from 'wagmi';
import { useRNSNavigation } from '@/contexts/RNSNavigationContext';

interface ConfirmRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    duration: number;
    registrationPrice: string;
    ethPrice: string;
    onConfirm: () => Promise<void>;
}

const ConfirmRegistrationModal = ({
                                      isOpen,
                                      onClose,
                                      name,
                                      duration,
                                      registrationPrice,
                                      ethPrice,
                                      onConfirm
                                  }: ConfirmRegistrationModalProps) => {
    const { navigateToSuccess } = useRNSNavigation();
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const { register } = useRegistration();
    const {isConnected} = useAccount();

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isSending) {
            const transactionData = {
                name,
                duration,
                registrationPrice,
                usdPrice: (Number(registrationPrice) * Number(ethPrice)).toFixed(2), // TODO - calculate this based on current ETH price
                timestamp: Date.now()
            };
            localStorage.setItem('transactionData', JSON.stringify(transactionData));

            intervalId = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(intervalId);
                        navigateToSuccess();
                        return 100;
                    }
                    return prev + (100/10);
                });
            }, 500);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isSending, navigateToSuccess, name, duration, registrationPrice, ethPrice]);

    if (!isOpen) return null;

    const handleOpenWallet = async () => {
        try {
            onConfirm().then(() => {
                register(name, BigInt(duration), registrationPrice).then(() => {
                    setIsSending(true);
                });
            });
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleDuration = (seconds: number) => {
        if (seconds === 0) {
            return "0 hours";
        }
        const duration = Duration.fromObject({ seconds });
        if (duration.as('days') < 1) {
            return duration.shiftTo('hours').toHuman();
        } else if (duration.as('weeks') < 1) {
            return duration.shiftTo('days').toHuman();
        } else if (duration.as('months') < 1) {
            return duration.shiftTo('weeks').toHuman();
        } else if (duration.as('years') < 1) {
            return duration.shiftTo('months').toHuman();
        } else {
            return duration.shiftTo('years').toHuman();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/[0.03] backdrop-blur-[8px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-[448px] shadow-lg">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-[22px] leading-7 font-semibold text-gray-900">
                            {isSending ? 'Transaction Sent' : 'Confirm Details'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {isSending ? (
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="text-[15px] leading-6 text-gray-600 text-center">
                                Your transaction is now in progress, you can close this and come back later.
                            </p>

                            {/* Transaction Details */}
                            <div className="space-y-2">
                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Name</span>
                                    <div className="flex items-center gap-2 max-w-[60%]">
                                        <span className="text-[15px] leading-6 text-gray-900 font-medium truncate">{trimmedDomainName(name)}</span>
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-90 flex-shrink-0" />
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Action</span>
                                    <span className="text-[15px] leading-6 text-gray-900 font-medium">Register Name</span>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Duration</span>
                                    <span className="text-[15px] leading-6 text-gray-900 font-medium">{handleDuration(duration)}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 px-4 rounded-2xl bg-gray-100 text-gray-900 hover:bg-gray-200
                                    transition-colors font-medium text-[15px] leading-6"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Wallet Icon */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center">
                                    <Wallet className="w-12 h-12 text-blue-500" />
                                </div>
                                <p className="text-[15px] leading-6 text-gray-600 text-center">
                                    Double check these details before confirming in your wallet.
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-2">
                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Name</span>
                                    <div className="flex items-center gap-2 max-w-[60%]">
                                        <span className="text-[15px] leading-6 text-gray-900 font-medium truncate">{trimmedDomainName(name)}</span>
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-90 flex-shrink-0" />
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Action</span>
                                    <span className="text-[15px] leading-6 text-gray-900 font-medium">Register Name</span>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-[15px] leading-6 text-gray-500">Duration</span>
                                    <span className="text-[15px] leading-6 text-gray-900 font-medium">{handleDuration(duration)}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {
                                isConnected ? (
                                    <button
                                onClick={handleOpenWallet}
                                className="w-full py-3 px-4 rounded-2xl bg-blue-500 text-white hover:bg-blue-600
                                    transition-colors font-medium text-[15px] leading-6"
                            >
                                Open Wallet
                            </button>
                                ) : <CustomWalletButton className="w-full py-3 px-4
                                transition-colors text-[15px] leading-6" />
                            }
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmRegistrationModal;
