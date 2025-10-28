import {useReadContract} from 'wagmi';
import {formatEther} from 'viem';
import {REGISTRAR_ABI} from '@/contracts/rns/revolutionRegistrar';
import {REGISTRATION_DURATIONS} from '@/config/rns/constants';
import {useNetwork} from '@/hooks/rns/useNetwork';

export function useNameAvailability(name: string, duration: bigint = BigInt(REGISTRATION_DURATIONS['1_year'])) {
    const { networkConfig } = useNetwork();

    const registrarAddress = networkConfig?.registrarAddress;

    const {data: isAvailable, isLoading: isCheckingAvailability, error: availabilityError} = useReadContract({
        address: registrarAddress as `0x${string}`,
        abi: REGISTRAR_ABI,
        functionName: 'available',
        args: [name],
        query: {
            enabled: Boolean(name && registrarAddress),
        }
    });

    const priceQueryEnabled = Boolean(
        name &&
        registrarAddress &&
        isAvailable !== undefined &&
        isAvailable !== null
    );

    const {data: price, isLoading: isLoadingPrice, error: priceError} = useReadContract({
        address: registrarAddress as `0x${string}`,
        abi: REGISTRAR_ABI,
        functionName: 'registerPrice',
        args: [name, BigInt(duration)],
        query: {
            enabled: priceQueryEnabled,
        }
    });

    const {data: minDuration} = useReadContract({
        address: registrarAddress as `0x${string}`,
        abi: REGISTRAR_ABI,
        functionName: 'minRegistrationDuration',
        args: [],
        query: {
            enabled: Boolean(registrarAddress),
        }
    });

    return {
        isAvailable,
        price: price ? formatEther(price) : null,
        isLoading: isCheckingAvailability || isLoadingPrice,
        minDuration,
        errors: {
            availability: availabilityError,
            price: priceError
        }
    };
}
