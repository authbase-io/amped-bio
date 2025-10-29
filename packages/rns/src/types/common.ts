import type {Abi} from 'viem';

export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface NameRegistrationResponse extends BaseResponse {
    transactionHash?: string;
    registeredName?: string;
    expiryDate?: Date;
}

export interface PriceResponse {
    basePrice: string;
    premium: string;
    total: string;
}

export interface NameAvailabilityResponse extends BaseResponse {
    isAvailable: boolean;
    price?: PriceResponse;
}

export type Duration = '1_year' | '2_years' | '3_years' | '5_years';

export interface RegistrationConfig {
    duration: Duration;
    reverseRecord: boolean;
    customResolver?: string;
}

export interface AddressResult {
    name?: string;
    address: `0x${string}`;
}

export type TransactionState = 'pending' | 'confirming' | 'complete' | 'failed';

export type TransactionStep = {
    id: number;
    name: string;
    type: 'setAddr' | 'setName' | 'reclaim' | 'transfer';
    status: 'pending' | 'confirming' | 'complete' | 'failed';
    hash?: `0x${string}`;
};

export type TransferTxn = {
    setAddrTx?: `0x${string}`;
    setNameTx?: `0x${string}`;
    reclaimTx?: `0x${string}`;
    transferTx?: `0x${string}`;
};

export type TransactionResults = {
    success: boolean;
    transactions: TransferTxn;
} | null;

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';


export type TxStep = 'setAddr' | 'setName' | 'reclaim' | 'transfer';
export type TxKeys = `${TxStep}Tx`;



export interface ContractStep {
    step: TxStep;
    contractAddress: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: readonly unknown[];
    logMessage: string;
}
