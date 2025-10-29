import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { useOwnerDetail } from "@/hooks/rns/useOwnerDetail";
import { useParams } from 'react-router-dom'
import {nftIdToBytes32, scannerURL, trimmedDomainName} from "@/utils/rns";
import { useNetwork } from '@/hooks/rns/useNetwork';

const MoreDetails = () => {
    const params = useParams();
    const name = typeof params.name === 'string' ? params.name : '';
    const { resolver, nftId } = useOwnerDetail(name);
    const hexData = nftIdToBytes32(nftId);
    const { networkConfig } = useNetwork();

    return (
        <div className="space-y-4 w-full max-w-4xl mx-auto px-4 sm:px-6">
            {/* Token Card */}
            <div className="card-standard">
                <div className="flex-between mb-6">
                    <h2 className="section-title mb-0">Token</h2>
                    <a href={scannerURL('nft', `${networkConfig?.baseAddress}/${nftId}`)} target='_blank'
                       className="btn-link">
                        {networkConfig?.blockExplorerName || 'Explorer'} <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-6">
                    <div className="space-y-4">
                        {/* Hex Value */}
                        <div className="content-box">
                            <div className="flex-between break-all">
                                <span className="label w-32 mb-2 sm:mb-0">hex</span>
                                <span className="text-sm pr-2 font-semibold">{hexData}</span>
                                <Copy onClick={() => navigator.clipboard.writeText(hexData)}
                                      className="icon-action ml-2 flex-shrink-0" />
                            </div>
                        </div>

                        {/* Decimal Value */}
                        <div className="content-box">
                            <div className="flex-between break-all">
                                <span className="label w-40 mb-2 sm:mb-0">decimal</span>
                                <span className="text-sm pr-2 font-semibold">{nftId}</span>
                                <Copy onClick={() => navigator.clipboard.writeText(String(nftId))}
                                      className="icon-action ml-2 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* ENS Logo Box */}
                    <div className="w-full max-w-xs bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white p-2 mx-0 sm:mx-auto sm:p-4">
                        <div className="mb-2">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm">{trimmedDomainName(name)}</span>
                    </div>
                </div>
            </div>

            {/* Name Wrapper Card */}
            {/*<div className="bg-white rounded-xl border p-4 sm:p-6">*/}
            {/*    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">*/}
            {/*        <div className="flex items-center gap-2">*/}
            {/*            <h2 className="text-xl font-semibold">Name Wrapper</h2>*/}
            {/*            <HelpCircle className="w-5 h-5 text-gray-400" />*/}
            {/*        </div>*/}
            {/*        <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">*/}
            {/*            Unwrap Name*/}
            {/*        </Button>*/}
            {/*    </div>*/}

            {/*    <div className="flex flex-col sm:flex-row gap-4">*/}
            {/*        <div className="bg-green-50 rounded-lg px-4 py-2 flex items-center gap-2">*/}
            {/*            <Check className="w-4 h-4 text-green-600" />*/}
            {/*            <span>Wrapped</span>*/}
            {/*        </div>*/}
            {/*        <div className="bg-green-50 rounded-lg px-4 py-2 flex items-center gap-2">*/}
            {/*            <Check className="w-4 h-4 text-green-600" />*/}
            {/*            <span>Not parent-controllable</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Resolver Card */}
            <div className="card-standard">
                <div className="flex-between mb-6">
                    <h2 className="section-title mb-0">Resolver</h2>
                </div>

                <div className="content-box">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                        <span className="break-all font-semibold">{resolver}</span>
                        <Copy onClick={() => navigator.clipboard.writeText(resolver as string)}
                              className="icon-action" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoreDetails;
