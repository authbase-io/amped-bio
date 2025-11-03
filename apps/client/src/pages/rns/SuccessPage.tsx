import {useEffect, useState} from 'react';
import { useRNSNavigation } from '@/contexts/RNSNavigationContext';
import RegistrationSuccess from '@/components/rns/registration/success';

interface TransactionData {
    name: string;
    duration: number;
    ethPrice: string;
    usdPrice: string;
    timestamp: number;
}

export default function SuccessPage() {
    const { navigateToHome, navigateToProfile } = useRNSNavigation();
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('transactionData');

        if (!storedData) {
            navigateToHome();
            return;
        }

        const data = JSON.parse(storedData) as TransactionData;
        setTransactionData(data);
        // setLoading(false);
    }, [navigateToHome]);


    if (!transactionData) {
        return null;
    }

    const handleRegisterAnother = () => {
        navigateToHome();
    };


    return (
        <RegistrationSuccess
            name={transactionData.name}
            duration={transactionData.duration}
            ethPrice={transactionData.ethPrice}
            usdPrice={transactionData.usdPrice}
            txFeeEth="0.002"
            txFeeUsd="3.45"
            onViewName={() => navigateToProfile(transactionData.name)}
            onRegisterAnother={handleRegisterAnother}
        />
    )
}
