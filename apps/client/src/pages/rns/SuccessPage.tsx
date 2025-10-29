import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import RegistrationSuccess from '@/components/rns/registration/success';

interface TransactionData {
    name: string;
    duration: number;
    ethPrice: string;
    usdPrice: string;
    timestamp: number;
}

export default function SuccessPage() {
    const navigate = useNavigate();
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('transactionData');

        if (!storedData) {
            navigate('/');
            return;
        }

        const data = JSON.parse(storedData) as TransactionData;
        setTransactionData(data);
        // setLoading(false);
    }, [navigate]);


    if (!transactionData) {
        return null;
    }

    const handleRegisterAnother = () => {
        navigate('/');
    };


    return (
        <RegistrationSuccess
            name={transactionData.name}
            duration={transactionData.duration}
            ethPrice={transactionData.ethPrice}
            usdPrice={transactionData.usdPrice}
            txFeeEth="0.002"
            txFeeUsd="3.45"
            onViewName={() => navigate(`/profile/${transactionData.name}`)}
            onRegisterAnother={handleRegisterAnother}
        />
    )
}
