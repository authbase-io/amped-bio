import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { RESOLVER_ABI } from '@/contracts/rns/revolutionResolver';
import { BASE_ABI } from '@/contracts/rns/revolutionBaseRegistrar';
import { REVERSE_REGISTRAR_ABI } from '@/contracts/rns/revolutionReverseRegistrar';
import { useNetwork } from '@/hooks/rns/useNetwork';
import { namehash, keccak256, toBytes } from 'viem';
import { domainName } from '@/utils/rns';
import { useState, useEffect, useMemo } from 'react';
import {ContractStep, TxKeys, TxStatus, TxStep} from "@/types/rns/common";
import { isAndroid } from '@/utils/rns/getDevice';



export function useTransferOwnership() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { networkConfig } = useNetwork();

    // Transaction status tracking
    const [transactions, setTransactions] = useState<{
        setAddrTx?: `0x${string}`;
        setNameTx?: `0x${string}`;
        reclaimTx?: `0x${string}`;
        transferTx?: `0x${string}`;
    }>({});

    // Track status for each transaction
    const [txStatuses, setTxStatuses] = useState<Record<TxStep, TxStatus>>({
        setAddr: 'idle',
        setName: 'idle',
        reclaim: 'idle',
        transfer: 'idle'
    });

    // Map of step names to transaction hash keys - wrapped in useMemo
    const stepToTxKey = useMemo<Record<TxStep, TxKeys>>(() => ({
        setAddr: 'setAddrTx',
        setName: 'setNameTx',
        reclaim: 'reclaimTx',
        transfer: 'transferTx'
    }), []);

    // Create individual receipt trackers for each transaction
    const setAddrReceipt = useWaitForTransactionReceipt({
        hash: transactions.setAddrTx,
        pollingInterval: 1_000,
    });

    const setNameReceipt = useWaitForTransactionReceipt({
        hash: transactions.setNameTx,
        pollingInterval: 1_000,
    });

    const reclaimReceipt = useWaitForTransactionReceipt({
        hash: transactions.reclaimTx,
        pollingInterval: 1_000,
    });

    const transferReceipt = useWaitForTransactionReceipt({
        hash: transactions.transferTx,
        pollingInterval: 1_000,
    });

    // Collect receipts into a single object
    const receiptTrackers = useMemo(() => ({
        setAddr: setAddrReceipt,
        setName: setNameReceipt,
        reclaim: reclaimReceipt,
        transfer: transferReceipt
    }), [setAddrReceipt, setNameReceipt, reclaimReceipt, transferReceipt]);

    // Update transaction statuses based on receipts
    useEffect(() => {
        Object.keys(stepToTxKey).forEach((step) => {
            const currentStep = step as TxStep;
            const txKey = stepToTxKey[currentStep];
            const receipt = receiptTrackers[currentStep];
            const hash = transactions[txKey as keyof typeof transactions];

            if (receipt.isSuccess && txStatuses[currentStep] !== 'success') {
                setTxStatuses(prev => ({ ...prev, [currentStep]: 'success' }));
            } else if (receipt.isError && txStatuses[currentStep] !== 'error') {
                setTxStatuses(prev => ({ ...prev, [currentStep]: 'error' }));
            } else if (hash && txStatuses[currentStep] === 'idle') {
                setTxStatuses(prev => ({ ...prev, [currentStep]: 'pending' }));
            }
        });
    }, [receiptTrackers, transactions, txStatuses, stepToTxKey]);

    // Calculate overall transaction status
    const getOverallStatus = (): TxStatus => {
        const statuses = Object.values(txStatuses);
        if (statuses.includes('error')) return 'error';
        if (statuses.includes('pending')) return 'pending';
        if (statuses.every(status => status === 'success')) return 'success';
        return 'idle';
    };

    // Generic function to update transaction data
    const updateTransactionData = (
        step: TxStep,
        hash: `0x${string}`
    ) => {
        const txKey = stepToTxKey[step];
        setTransactions(prev => ({
            ...prev,
            [txKey]: hash
        }));
        setTxStatuses(prev => ({
            ...prev,
            [step]: 'pending'
        }));
    };

    const waitForFocus = (): Promise<void> => {
        if (!isAndroid()) {
            return Promise.resolve(); // Skip wait on iOS and desktop
        }

        return new Promise((resolve) => {
            if (document.hasFocus()) {
                resolve();
            } else {
                const onFocus = () => {
                    window.removeEventListener("focus", onFocus);
                    resolve();
                };
                window.addEventListener("focus", onFocus);
            }
        });
    };

    const transferOwnership = async (
        name: string,
        receiverAddress: `0x${string}`
    ): Promise<{
        success: boolean;
        transactions: {
            setAddrTx?: `0x${string}`;
            setNameTx?: `0x${string}`;
            reclaimTx?: `0x${string}`;
            transferTx?: `0x${string}`;
        };
        error?: Error;
    }> => {
        if (!address) throw new Error('No wallet connected');
        if (!receiverAddress) throw new Error('Receiver address is required');

        // Reset transaction statuses
        setTransactions({});
        setTxStatuses({
            setAddr: 'idle',
            setName: 'idle',
            reclaim: 'idle',
            transfer: 'idle'
        });

        const node = namehash(domainName(name));
        const tokenId = (() => {
            const bytes32 = toBytes(name);
            const hash = keccak256(bytes32);
            return BigInt(hash);
        })();

        console.log('Transferring ownership', {
            name,
            node,
            tokenId,
            from: address,
            to: receiverAddress
        });

        try {
            const txs = {} as {
                setAddrTx?: `0x${string}`;
                setNameTx?: `0x${string}`;
                reclaimTx?: `0x${string}`;
                transferTx?: `0x${string}`;
            };

            // Define contract interaction steps
            const steps: ContractStep[] = [
                {
                    step: 'setAddr',
                    contractAddress: networkConfig?.resolverAddress as `0x${string}`,
                    abi: RESOLVER_ABI,
                    functionName: 'setAddr',
                    args: [node, receiverAddress],
                    logMessage: 'Updated resolver address'
                },
                {
                    step: 'setName',
                    contractAddress: networkConfig?.reverseRegistrarAddress as `0x${string}`,
                    abi: REVERSE_REGISTRAR_ABI,
                    functionName: 'setName',
                    args: [''],
                    logMessage: 'Cleared reverse record'
                },
                {
                    step: 'reclaim',
                    contractAddress: networkConfig?.baseAddress as `0x${string}`,
                    abi: BASE_ABI,
                    functionName: 'reclaim',
                    args: [tokenId, receiverAddress],
                    logMessage: 'Reclaimed NFT'
                },
                {
                    step: 'transfer',
                    contractAddress: networkConfig?.baseAddress as `0x${string}`,
                    abi: BASE_ABI,
                    functionName: 'safeTransferFrom',
                    args: [address, receiverAddress, tokenId],
                    logMessage: 'Transferred NFT'
                }
            ];

            // Execute each step
            for (let i = 0; i < steps.length; i++) {
                const { step, contractAddress, abi, functionName, args, logMessage } = steps[i];
                const txKey = stepToTxKey[step];

                txs[txKey as keyof typeof txs] = await writeContractAsync({
                    address: contractAddress,
                    abi,
                    functionName,
                    args
                });

                updateTransactionData(step, txs[txKey as keyof typeof txs] as `0x${string}`);
                console.log(`Step ${i+1}: ${logMessage}`, txs[txKey as keyof typeof txs]);

                await waitForFocus();
            }

            return {
                success: true,
                transactions: txs
            };
        } catch (error) {
            console.error('Transfer ownership error:', error);
            return {
                success: false,
                transactions: {},
                error: error instanceof Error ? error : new Error('Unknown error during transfer')
            };
        }
    };

    const isConnected = Boolean(address);

    return {
        transferOwnership,
        isConnected,
        txStatuses,
        transactions,
        overallStatus: getOverallStatus()
    };
}
