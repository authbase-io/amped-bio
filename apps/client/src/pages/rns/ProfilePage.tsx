import { useNameAvailability } from '@/hooks/rns/useNameAvailability';
import { ProfileCard } from '@/components/rns/profile/ProfileCard';
import {useOwnerDetail} from "@/hooks/rns/useOwnerDetail";

interface ProfilePageProps {
    name: string;
    activeTab?: 'details' | 'ownership' | 'more';
}

export default function ProfilePage({ name, activeTab = 'details' }: ProfilePageProps) {
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
