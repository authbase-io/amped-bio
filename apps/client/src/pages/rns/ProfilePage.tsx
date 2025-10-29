import { useParams } from 'react-router-dom';
import { useNameAvailability } from '@/hooks/rns/useNameAvailability';
import { ProfileCard } from '@/components/rns/profile/ProfileCard';
import {useOwnerDetail} from "@/hooks/rns/useOwnerDetail";

export default function ProfilePage() {
    const params = useParams();
    const name = typeof params.name === 'string' ? params.name : '';
    const { expiryDate, ownerAddress } = useOwnerDetail(name);

    const {
        isLoading
    } = useNameAvailability(name);

    if (isLoading) {
        return (
            <div className=" flex items-center justify-center">
                <div className="loading"/>
            </div>
        );
    }

    return (
        <ProfileCard
            name={name}
            addressFull={ownerAddress.full}
            addressFormatted={ownerAddress.formatted}
            expiry={expiryDate.date}
            registrant={ownerAddress.formatted}
        />
    );
}
