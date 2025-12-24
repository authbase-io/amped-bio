import { useReadContract } from "wagmi";
import { keccak256, toBytes } from "viem";
import { formatDateTime } from "@/utils/rns";
import { NameDetails } from "@/types/rns/name";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { RegistrationData } from "@/types/rns/registration";
import { useSubgraphClient } from "@/services/subgraph/subgraphClient";
import { fetchRegistrationData } from "@/services/subgraph/queries";
import { getChainConfig, REGISTRAR_CONTROLLER_ABI } from "@ampedbio/web3";

export function useNameDetails(name: string) {
  const { address: connectedWallet, chainId } = useAccount();
  const networkConfig = getChainConfig(chainId ?? 0);
  const subgraphClient = useSubgraphClient();

  const [names, setNames] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getNameDetails = async () => {
      setIsLoading(true);
      try {
        const labelHash = keccak256(toBytes(name));
        const response = await fetchRegistrationData(labelHash, subgraphClient);
        setNames(response.data);
        console.log("RESPONSE NAME", response.data);

        setError(response.error);
      } catch (error) {
        console.log(error);
        setError("Error While Fetching Registration Data");
      } finally {
        setIsLoading(false);
      }
    };

    getNameDetails();
  }, [name, refreshKey, subgraphClient]);

  const { data: isAvailable } = useReadContract({
    address: networkConfig?.contracts.REGISTRAR_CONTROLLER.address,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: "available",
    args: [name],
    query: {
      enabled: Boolean(name && networkConfig?.contracts.REGISTRAR_CONTROLLER.address),
    },
  });

  const tokenId = (() => {
    const bytes32 = toBytes(name);
    const hash = keccak256(bytes32);
    return BigInt(hash);
  })();
  console.log(names?.revoNames[0]);

  const nameOwnerAddress = names?.revoNames[0]?.owner;

  const details: NameDetails = {
    name,
    ownerAddress: nameOwnerAddress as `0x${string}`,
    displayAddress: nameOwnerAddress
      ? `${nameOwnerAddress.slice(0, 6)}...${nameOwnerAddress.slice(-4)}`
      : "",
    contractAddress: networkConfig?.contracts?.REGISTRAR_CONTROLLER.address ?? "",
    status: isAvailable ? "available" : "registered",
    roles: nameOwnerAddress ? ["Owner", "ETH record"] : [],
    dates: {
      expiry: formatDateTime(Number(names?.registration?.expiryDate)),
      gracePeriod: formatDateTime(Number(names?.revoNames[0].expiryDateWithGrace)),
      registration: formatDateTime(Number(names?.registration?.registrationDate)),
    },
  };

  const transactionHash = names?.nameRegistereds[0]?.transactionID as `0x${string}`;

  const refetchNameDetails = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    ...details,
    isCurrentOwner: connectedWallet?.toLowerCase() === nameOwnerAddress?.toLowerCase(),
    nftId: tokenId,
    resolver: names?.revoNames[0]?.resolver?.address,
    transactionHash,
    error,
    refetchNameDetails,
    isLoading,
  };
}
