import React from "react";
import {Outlet, useParams} from "react-router-dom";
import { ProfileNav } from '@/components/rns/profile/ProfileNav';
import { ExternalLink, Copy } from 'lucide-react';
import {domainName, scannerURL, trimmedDomainName} from "@/utils/rns";
import { useOwnerDetail } from "@/hooks/rns/useOwnerDetail";

export default function ProfileLayout() {
    const {name} = useParams() as {name: string};
    const { ownerAddress } = useOwnerDetail(name);

    return (
        <div>
            <div className="page-container">
                <div className="header-container">
                    <div className="flex-center gap-2">
                        <h1 className="page-title hidden sm:flex">{trimmedDomainName(name)}</h1>
                        <button className="text-gray-400 hover:text-gray-600 hidden sm:flex">
                            <Copy className="icon-action"onClick={() => navigator.clipboard.writeText(domainName(name))}/>
                        </button>
                    </div>
                    <a
                        href={scannerURL('address', ownerAddress.full)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link text-md font-bold flex-auto sm:flex-none"
                    >
                        <ExternalLink className="w-3 h-3" /> Etherscan
                    </a>
                </div>

                <div className="px-5">
                    <ProfileNav name={name} />


                </div>

                <div className="overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
