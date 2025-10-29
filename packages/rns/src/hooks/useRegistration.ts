import {useAccount, useWriteContract} from 'wagmi';
import {REGISTRAR_ABI} from '../contracts/revolutionRegistrar';
import {RESOLVER_ABI} from "../contracts/revolutionResolver";
import {useNetwork} from './useNetwork';
import {encodeFunctionData, namehash, parseEther} from 'viem'
import {domainName} from "../utils";
import { normalize } from 'viem/ens';

export function useRegistration() {
    const {address} = useAccount();
    const {writeContractAsync} = useWriteContract();
    const {networkConfig} = useNetwork();

    const register = async (name: string, duration: bigint, rentPrice: string): Promise<string> => {
        if (!address) throw new Error('No wallet connected');
        const normalizedName = normalize(domainName(name));

        const data = encodeFunctionData({
            abi: RESOLVER_ABI,
            functionName: 'setAddr',
            args: [namehash(normalizedName), address]
        });

        try {
            const registrationRequest = {
                name,
                owner: address,
                duration: duration,
                resolver: networkConfig?.resolverAddress as `0x${string}`,
                data: [data],
                reverseRecord: true
            };

            const hash: string = await writeContractAsync({
                address: networkConfig?.registrarAddress as `0x${string}`,
                abi: REGISTRAR_ABI,
                functionName: 'register',
                args: [registrationRequest],
                value: parseEther(rentPrice.toString())
            });

            console.log('Registration transaction hash:', hash);
            return hash;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    return {
        register,
        isRegistering: false
    };
}