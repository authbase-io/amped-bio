import { useReadContract } from 'wagmi';
import { REGISTRAR_ABI } from '../contracts/revolutionRegistrar';
import { useNetwork } from './useNetwork';
import { keccak256, toBytes } from 'viem';
import { formatDateTime } from '../utils';
import { NameDetails } from '../types/name';
import {useAccount} from "wagmi";
import { useEffect, useState } from 'react';
import { RegistrationData } from '../types/registration';
import { fetchRegistrationData } from '../subgraph/queries';
import { useSubgraphClient } from '../subgraph/subgraphClient';

export function useNameDetails(name: string) {
    const { address: ownerAddress } = useAccount();
    const { networkConfig } = useNetwork();
    const subgraphClient = useSubgraphClient();

    // const node = namehash(name);

    const [names, setNames] = useState<RegistrationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const getNameDetails = async () => {
            try {
                const labelHash = keccak256(toBytes(name));
                const response = await fetchRegistrationData(labelHash, subgraphClient);
                setNames(response.data);
                setError(response.error)
            }catch(error) {
                console.log(error);
                setError("Error While Fetching Registration Data");
            }
        }

        getNameDetails();
    }, [name, refreshKey, subgraphClient])

    const { data: isAvailable } = useReadContract({
        address: networkConfig?.registrarAddress as `0x${string}`,
        abi: REGISTRAR_ABI,
        functionName: 'available',
        args: [name],
        query: {
            enabled: Boolean(name && networkConfig?.registrarAddress),
        }
    });

    const details: NameDetails = {
        name,
        ownerAddress: ownerAddress || '',
        displayAddress: ownerAddress ? `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}` : '',
        contractAddress: networkConfig?.registrarAddress as `0x${string}`,
        status: isAvailable ? 'available' : 'registered',
        roles: ownerAddress ? ['Owner', 'ETH record'] : [],
        dates:{
            expiry: formatDateTime(Number(names?.registration?.expiryDate)),
            gracePeriod: formatDateTime(Number(names?.registration?.expiryDate) + Number(60 * 60)),
            registration: formatDateTime(Number(names?.registration?.registrationDate))
        }
    };

    const transactionHash = names?.nameRegistereds[0]?.transactionID;

    console.log('Generated name details:', details);

    const refetch = () => {
        setRefreshKey(prev => prev + 1);
    };

    return {
        details,
        transactionHash,
        error,
        refetch
    };
}
