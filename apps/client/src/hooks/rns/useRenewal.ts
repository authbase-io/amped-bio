import { useWriteContract, useReadContract, useChainId } from "wagmi";
import { calculateNewExpiryDate } from "@/utils/rns";
import { getChainConfig, REGISTRAR_CONTROLLER_ABI } from "@ampedbio/web3";

export function useRenewal(name: string, duration: bigint, expiryDate: bigint) {
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const networkConfig = getChainConfig(chainId);
  
  const { data: rentPriceData, isLoading: isPriceLoading } = useReadContract({
    address: networkConfig?.contracts?.REGISTRAR_CONTROLLER.address,
    abi: REGISTRAR_CONTROLLER_ABI,
    functionName: "rentPrice",
    args: [name, duration],
    query: {
      enabled: Boolean(name && duration && networkConfig?.contracts?.REGISTRAR_CONTROLLER.address),
    },
  });

  const totalPrice = rentPriceData ? rentPriceData.base + rentPriceData.premium : null;

  const renew = async () => {
    try {
      if (!totalPrice) throw new Error("Failed to get renewal price");

      const hash = await writeContractAsync({
        address: networkConfig?.contracts?.REGISTRAR_CONTROLLER.address!,
        abi: REGISTRAR_CONTROLLER_ABI,
        functionName: "renew",
        args: [name, duration],
        value: totalPrice,
      });

      return {
        newExpiryDate: calculateNewExpiryDate(duration, expiryDate),
        price: totalPrice,
        transactionHash: hash,
      };
    } catch (error) {
      console.error("Renewal error:", error);
      throw error;
    }
  };

  return {
    renew,
    price: totalPrice,
    isPriceLoading,
  };
}
