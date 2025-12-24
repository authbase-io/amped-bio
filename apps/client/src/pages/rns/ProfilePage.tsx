import { useNameAvailability } from "@/hooks/rns/useNameAvailability";
import { domainName, scannerURL, trimmedDomainName } from "@/utils/rns";
import { Copy, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/Button";
import { useRNSNavigation } from "@/contexts/RNSNavigationContext";
import { ProfileCard } from "@/components/rns/profile/ProfileCard";
import { ProfileNav } from "@/components/rns/profile/ProfileNav";
import MoreDetails from "@/components/rns/profile/MoreDetail";
import OwnershipDetail from "@/components/rns/profile/ProfileOwnership";
import { useNameDetails } from "@/hooks/rns/useNameDetails";

interface ProfilePageProps {
  name: string;
  activeTab?: "details" | "ownership" | "more";
}

export default function ProfilePage({ name, activeTab = "details" }: ProfilePageProps) {
  const {
    displayAddress,
    ownerAddress,
    dates,
    transactionHash,
    isCurrentOwner,
    nftId,
    resolver,
    refetchNameDetails,
    isLoading,
  } = useNameDetails(name);
  const { address: connectedWallet } = useAccount();
  const { navigateToHome, navigateToRegister } = useRNSNavigation();
  const { isAvailable } = useNameAvailability(name);

  const isDifferentOwner =
    connectedWallet && ownerAddress && connectedWallet.toLowerCase() !== ownerAddress.toLowerCase();
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isAvailable) {
    navigateToRegister(name);
    return null;
  }

  return (
    <div className="my-2 sm:my-10 max-w-[840px] w-full mx-auto px-3 sm:px-6">
      <div className="px-6 py-2 sm:py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-3xl font-bold text-black hidden sm:flex">
            {trimmedDomainName(name)}
          </h1>
          <button className="text-gray-400 hover:text-gray-600 hidden sm:flex">
            <Copy
              className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(domainName(name))}
            />
          </button>
        </div>

        {isDifferentOwner && (
          <div className="">
            <Button onClick={navigateToHome} title="Register a new REVO name for your wallet">
              Register your own REVO Name
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-5 gap-1">
        <ProfileNav
          name={name}
          activeTab={activeTab}
          connectedWallet={connectedWallet}
          addressFull={ownerAddress}
        />

        <a
          href={scannerURL("address", ownerAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto sm:ml-0 text-blue-500 hover:text-blue-600 flex items-center gap-1 text-md font-bold"
        >
          <ExternalLink className="w-3 h-3" />
          Explorer
        </a>
      </div>

      {activeTab === "details" && (
        <ProfileCard
          name={name}
          addressFull={ownerAddress}
          addressFormatted={displayAddress}
          expiry={dates.expiry.date}
          registrant={ownerAddress}
        />
      )}
      {activeTab === "ownership" && (
        <OwnershipDetail
          name={name}
          dates={dates}
          displayAddress={displayAddress}
          ownerAddress={ownerAddress}
          transactionHash={transactionHash}
          isCurrentOwner={isCurrentOwner}
          isNameDetailsLoading={isLoading}
          refetchNameDetails={refetchNameDetails}
        />
      )}
      {activeTab === "more" && <MoreDetails name={name} nftId={nftId} resolver={resolver} />}
    </div>
  );
}
