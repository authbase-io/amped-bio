import {useReadContract} from 'wagmi';
import {REVERSE_REGISTRAR_ABI} from '@/contracts/rns/revolutionReverseRegistrar';
import {useNetwork} from '@/hooks/rns/useNetwork';
import {RESOLVER_ABI} from "@/contracts/rns/revolutionResolver";

export function useReverseLookup(address: `0x${string}` ) {
    const {networkConfig} = useNetwork();

    const {data: labelHash, isLoading: isLoadingAddr} = useReadContract({
        address: networkConfig?.reverseRegistrarAddress as `0x${string}`,
        abi: REVERSE_REGISTRAR_ABI,
        functionName: 'node',
        args: [address],
        query: {
            enabled: Boolean(address && networkConfig?.reverseRegistrarAddress),
        }
    });

    const {data: name} = useReadContract({
        address: networkConfig?.resolverAddress as `0x${string}`,
        abi: RESOLVER_ABI,
        functionName: 'name',
        args: [labelHash as `0x${string}`],
        query: {
            enabled: Boolean(labelHash && networkConfig?.resolverAddress),
        }
    });

    return {
        isLoadingAddr: isLoadingAddr,
        fullName: name,
        name: name ? name.split('.')[0] : '',
    };
}
