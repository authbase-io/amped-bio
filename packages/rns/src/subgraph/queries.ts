import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";
import { subgraphClient } from "./subgraphClient";
import { Address } from "viem";
import { Name, NameDetail } from "../types/name";
import { RegistrationData } from "../types/registration";

interface GetAllNamesResult {
  revoNames: Name[];
}

type SubgraphResult<T> = {
  data: T | null;
  error: string | null;
};

export const queryGetAllRegisteredNamesOfOwner = gql`
  query getAllNames($owner: String!) {
    revoNames(where: { owner: $owner, name_not: null }) {
      name
      labelName
      expiryDateWithGrace
    }
  }
`;

export const queryRegistrationDetailForName = gql`
  query getRegistrationData($labelHash: String!) {
    registration(id: $labelHash) {
      registrationDate
      expiryDate
    }
    nameRegistereds(
      where: { registration: $labelHash }
      orderBy: blockNumber
      orderDirection: desc
      first: 1
    ) {
      transactionID
    }
  }
`;

export const queryGetNameDetails = gql`
  query getNameDetails($labelName: String!) {
    revoNames(where: { labelName: $labelName }) {
      name
      labelHash
      expiryDateWithGrace
      owner
      resolver {
        address
      }
      registration {
        registrationDate
        expiryDate
      }
    }
  }
`;

export const queryGetRecords = gql`
  query getRecords($labelName: String!) {
    revoNames(where: { labelName: $labelName }) {
      labelHash
      resolver {
        address
      }
    }
  }
`;

export async function fetchAllRegisteredNamesOfOwner(
  owner: Address,
  client?: GraphQLClient | null,
): Promise<SubgraphResult<Name[]>> {
  try {
    const graphClient = client || subgraphClient;
    if (!graphClient) {
      return { data: null, error: "Subgraph client not available for current network" };
    }

    const variables = { owner };
    const data = await graphClient.request<GetAllNamesResult>(
      queryGetAllRegisteredNamesOfOwner,
      variables,
    );

    return { data: data.revoNames, error: null };
  } catch (err) {
    console.error("Error Fetching names", err);
    return { data: null, error: "Failed to Fetch Names" };
  }
}

export async function fetchRegistrationData(
  labelHash: string,
  client?: GraphQLClient | null,
): Promise<SubgraphResult<RegistrationData>> {
  try {
    const graphClient = client || subgraphClient;
    if (!graphClient) {
      return { data: null, error: "Subgraph client not available for current network" };
    }

    const variables = { labelHash };
    const data = await graphClient.request<RegistrationData>(
      queryRegistrationDetailForName,
      variables,
    );

    return { data: data, error: null };
  } catch (err) {
    console.error("Error Fetching details", err);
    return { data: null, error: "Failed to get Registration Data" };
  }
}

export async function fetchGetNameDetails(
  labelName: string,
  client?: GraphQLClient | null,
): Promise<SubgraphResult<NameDetail[]>> {
  try {
    const graphClient = client || subgraphClient;
    if (!graphClient) {
      return { data: null, error: "Subgraph client not available for current network" };
    }

    const data = await graphClient.request<{ revoNames: NameDetail[] }>(
      queryGetNameDetails,
      { labelName },
    );
    return { data: data.revoNames, error: null };
  } catch (err) {
    console.error("Error Fetching details", err);
    return { data: null, error: "Failed to Fetch Name Details" };
  }
}

export async function fetchRecords(
  labelName: string,
  client?: GraphQLClient | null,
) {
  try {
    const graphClient = client || subgraphClient;
    if (!graphClient) {
      return { data: null, error: "Subgraph client not available for current network" };
    }

    const data = await graphClient.request(queryGetRecords, { labelName });

    return { data, error: null };
  } catch (err) {
    console.error("Error Fetching details", err);
    return { data: null, error: "Failed to fetch Resovler Details" };
  }
}