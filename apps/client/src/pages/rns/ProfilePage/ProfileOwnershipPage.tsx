import React, {useState} from 'react';
import {
    HelpCircle,
    Send,
    FastForward
} from 'lucide-react';
import TransferNameModal from "@/components/rns/modal/TransferNameModal";
import RoleDropdown from "@/components/profile/RoleDropdown";
import EditRolesModal from "@/components/rns/modal/EditRolesModal";
import ExtendRegistrationModal from "@/components/rns/modal/ExtendRegistrationModal";
import {useNameDetails} from "@/hooks/rns/useNameDetails";
import { useNavigate, useParams } from 'react-router-dom'
import {useOwnerDetail} from "@/hooks/rns/useOwnerDetail";
import {useNameAvailability} from "@/hooks/rns/useNameAvailability";
import {formatDateTime, scannerURL} from "@/utils/rns";

const OwnershipDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const name = typeof params.name === 'string' ? params.name : '';
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isEdtModalOpen, setIsEdtModalOpen] = useState(false);
    const [isExtRegModalOpen, setIsExtRegModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const {details, transactionHash, refetch: refetchNameDetails} = useNameDetails(name);
    const {expiryDate, ownerAddress, isCurrentOwner, refetch: refetchOwnerDetail} = useOwnerDetail(name);
    // const [hasExtended, setHasExtended] = useState(false);
    // const [hasTransfered, setHasTransfered] = useState(false);

    // useEffect(() => {
    //     if (hasExtended && !isExtRegModalOpen) {
    //         const timer = setTimeout(() => {
    //             window.location.reload();
    //             setHasExtended(false);
    //         }, 100);
    //         return () => clearTimeout(timer);
    //     }

    //     if (hasTransfered && !isTransferModalOpen) {
    //         const timer = setTimeout(() => {
    //             window.location.reload();
    //             setHasTransfered(false);
    //         }, 100);
    //         return () => clearTimeout(timer);
    //     }
    // }, [isExtRegModalOpen, hasExtended, hasTransfered, isTransferModalOpen]);


    const {
        isAvailable,
    } = useNameAvailability(name);

    if (isAvailable) {
        navigate(`/register/${name}`);
        return null;
    }

    if (!details) {
        return <div className="text-center py-4 text-gray-600">Failed to load name details</div>;
    }

    return (
        <div className="w-full mx-auto max-w-4xl space-y-4 px-3 sm:px-6">
            {/* Roles Section */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4 sm:mb-5">
                        <h2 className="text-2xl font-bold">Roles</h2>
                        <span className="text-blue-500 text-xs font-bold bg-blue-50 p-1 rounded-2xl">1 address</span>
                    </div>

                    <div className="border-y py-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0 overflow-hidden"
                                />
                                <div>
                                    {/*<div className="font-medium">{details.name}</div>*/}
                                    <div className="text-black font-bold text-md">{ownerAddress.formatted}</div>
                                </div>
                            </div>

                            {/* Desktop view - horizontal row */}
                            <div className="items-center gap-4 hidden sm:flex">
                                <button className="px-4 py-1 border-2 border-gray-200 hover:bg-gray-200 text-sm text-blue-600 font-bold">
                                    Owner
                                </button>

                                <button className="px-4 py-1 border-2 border-gray-200 hover:bg-gray-200 text-sm text-blue-600 font-bold">
                                    ETH record
                                </button>
                                <RoleDropdown name={name}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 sm:hidden mt-4">
                        <button className="px-4 py-1 border-2 border-gray-200 hover:bg-gray-200 text-sm text-blue-600 font-bold w-full">
                            Owner
                        </button>

                        <button className="px-4 py-1 border-2 border-gray-200 hover:bg-gray-200 text-sm text-blue-600 font-bold w-full">
                            ETH record
                        </button>
                        <div className="w-full">
                            <RoleDropdown name={name}/>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
                        {isCurrentOwner && <button
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 w-full sm:w-auto"
                            onClick={() => setIsTransferModalOpen(true)}>
                            <Send className="w-4 h-4"/>
                            Send
                        </button>}
                    </div>
                </div>
            </div>

            {/* Dates Section */}
            <div className="bg-white rounded-xl shadow-sm border relative">
                {isUpdating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span>Updating expiry date...</span>
                        </div>
                    </div>
                )}
                <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:pb-2 md:border-b-2 md:border-gray-100">
                        <div className="md:border-r-2 md:border-gray-100 md:p-2 ">
                            <h3 className="text-base font-bold mb-1">Name expires</h3>
                            <div className="text-base font-semibold">{expiryDate.date}</div>
                            <div className="text-gray-500 text-sm">{expiryDate.time}</div>
                        </div>
                        <div className="md:border-r-2 md:border-gray-100 md:p-2">
                            <div className="flex items-center gap-1">
                                <h3 className="text-base font-bold mb-1">Grace period ends</h3>
                                <HelpCircle className="w-4 h-4 text-gray-400"/>
                            </div>
                            <div className="text-base font-semibold">{expiryDate.graceDate}</div>
                            <div className="text-gray-500 text-sm">{expiryDate.graceTime}</div>
                        </div>
                        <div className="md:border-r-2 md:border-transparent md:p-2">
                            <div className="flex items-center gap-1">
                                <h3 className="text-base font-bold mb-1">Registered</h3>
                                {transactionHash && (
                                    <a href={scannerURL('tx', `${transactionHash}`)} target='_blank'
                                       className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
                                        View
                                    </a>
                                )}
                            </div>
                            <div className="text-base font-semibold">{details.dates.registration.date == "Invalid DateTime" ? formatDateTime(Date.now()).date : details.dates.registration.date}</div>
                            <div className="text-gray-500 text-sm">{details.dates.registration.time == "Invalid DateTime" ? formatDateTime(Date.now()).time : details.dates.registration.time}</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6  pb-6">
                        {/*<button*/}
                        {/*    className="flex items-center gap-1 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">*/}
                        {/*    <Calendar className="w-4 h-4"/>*/}
                        {/*    Set reminder*/}
                        {/*</button>*/}
                        {isCurrentOwner && <button
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
                            onClick={() => setIsExtRegModalOpen(true)}>
                            <FastForward className="w-4 h-4"/>
                            Extend
                        </button>}
                    </div>
                </div>
            </div>

            {/* Contract Address Section */}
            {/*<div className="bg-white rounded-xl shadow-sm border">*/}
            {/*    <div className="p-5 sm:p-6">*/}
            {/*        <div className="flex items-center gap-1 mb-4">*/}
            {/*            <h3 className="text-base font-medium">Contract address</h3>*/}
            {/*            <HelpCircle className="w-4 h-4 text-gray-400"/>*/}
            {/*        </div>*/}

            {/*        <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-4">*/}
            {/*            <span className="text-gray-700 text-sm break-all pr-2">{details.contractAddress}</span>*/}

            {/*            <a href={scannerURL('address', details.contractAddress)}*/}
            {/*               target="_blank"*/}
            {/*               rel="noopener noreferrer"*/}
            {/*            >*/}
            {/*                <ArrowUpRight className="w-4 h-4 text-gray-400"/>*/}
            {/*            </a>*/}
            {/*        </div>*/}

            {/*        <div className="bg-blue-50 p-4 rounded-lg flex gap-3">*/}
            {/*            <Info className="w-5 h-5 text-blue-500 flex-shrink-0"/>*/}
            {/*            <p className="text-gray-700 text-sm">*/}
            {/*                Some apps may show the contract address as the owner. This doesn&#39;t affect your*/}
            {/*                ownership.*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {isTransferModalOpen && (
                <TransferNameModal
                    onClose={() => {
                        setIsTransferModalOpen(false)
                        // setHasTransfered(true)
                        // setRefreshKey((prev) => prev + 1);
                    }}
                    ensName={details.name}
                    expiryDate={details.dates.expiry.date}
                />
            )}

            {isExtRegModalOpen && (
                <ExtendRegistrationModal
                    isOpen={isExtRegModalOpen}
                    onClose={() => {
                        setIsExtRegModalOpen(false)
                    }}
                    onSuccess={async () => {
                        setIsExtRegModalOpen(false);
                        setIsUpdating(true);

                        // Improved polling with data change detection
                        let attempts = 0;
                        const previousExpiry = expiryDate.date;

                        const interval = setInterval(async () => {
                            await refetchNameDetails();
                            await refetchOwnerDetail();
                            attempts++;

                            // Check if data has actually updated
                            if (expiryDate.date && expiryDate.date !== previousExpiry) {
                                clearInterval(interval);
                                setIsUpdating(false);
                            } else if (attempts >= 20) {
                                // Increased attempts for better UX
                                clearInterval(interval);
                                setIsUpdating(false);
                                // Only reload if data still hasn't updated after 40 seconds
                                if (expiryDate.date === previousExpiry) {
                                    setTimeout(() => window.location.reload(), 1000);
                                }
                            }
                        }, 2000);
                    }}
                    ensName={details.name}
                    currentExpiryDate={details.dates.expiry.timestamp}
                />
            )}

            {isEdtModalOpen && (
                <EditRolesModal
                    isOpen={isEdtModalOpen}
                    onClose={() => setIsEdtModalOpen(false)}
                    onSave={() => setIsEdtModalOpen(false)}
                />
            )}
        </div>
    );
};

export default OwnershipDetails;
