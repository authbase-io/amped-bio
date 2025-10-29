import { fetchAllRegisteredNamesOfOwner } from "../subgraph/queries";
import { useSubgraphClient } from "../subgraph/subgraphClient";
import { Name } from "../types/name";
import { useEffect, useState } from "react";
import { Address } from "viem";

export default function useGetAllRegisteredNames(
  address: Address | undefined,
  isConnected: boolean,
) {
  const [isFetching, setIsFetching] = useState(true);
  const [names, setNames] = useState<Name[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const subgraphClient = useSubgraphClient();

  const fetchData = async () => {
    if(!address) {
      return
    }

    setIsFetching(true);
    try {
      const response = await fetchAllRegisteredNamesOfOwner(address, subgraphClient);
      setNames(response.data);
      setError(response.error);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Something went wrong while fetching names.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address, isConnected, subgraphClient]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isFetching,
    names,
    error,
    refetch: fetchData,
  };
}
