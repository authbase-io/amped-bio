import { useWriteContract, useReadContract } from 'wagmi';
import { REGISTRAR_ABI } from '@/contracts/rns/revolutionRegistrar';
import { useNetwork } from '@/hooks/rns/useNetwork';
import { calculateNewExpiryDate } from '@/utils/rns';

export function useRenewal(name: string, duration: bigint, expiryDate: bigint) {
    const { writeContractAsync } = useWriteContract();
    const { networkConfig } = useNetwork();

    const { data: rentPriceData, isLoading: isPriceLoading } = useReadContract({
        address: networkConfig?.registrarAddress as `0x${string}`,
        abi: REGISTRAR_ABI,
        functionName: 'rentPrice',
        args: [name, duration],
        query: {
            enabled: Boolean(name && duration && networkConfig?.registrarAddress),
        }
    });

    const totalPrice = rentPriceData ? rentPriceData.base + rentPriceData.premium : null;

    const renew = async () => {
        try {
            if (!totalPrice) throw new Error('Failed to get renewal price');

            const hash = await writeContractAsync({
                address: networkConfig?.registrarAddress as `0x${string}`,
                abi: REGISTRAR_ABI,
                functionName: 'renew',
                args: [name, duration],
                value: totalPrice
            });

            return {
                newExpiryDate: calculateNewExpiryDate(duration, expiryDate),
                price: totalPrice,
                transactionHash: hash
            };
        } catch (error) {
            console.error('Renewal error:', error);
            throw error;
        }
    };

    return {
        renew,
        price: totalPrice,
        isPriceLoading
    };
}
