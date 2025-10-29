import React from 'react';
import { trimmedDomainName} from "@/utils/rns";
import { Link } from 'react-router-dom'
import VerificationBadge from './VerificationBadge';

interface ProfileCardProps {
    name: string;
    addressFull?: string;
    addressFormatted: string;
    expiry: string;
    registrant?: string;
}

export const ProfileCard = ({ name, addressFormatted, expiry }: ProfileCardProps) => {
    return (
        <main className="content-container">
                {/* Profile Header Card */}
                <div className="card-base overflow-hidden mb-4">
                    <div className="profile-header-indigo"></div>

                    <div className="profile-content-with-avatar">
                        <div className="profile-avatar-top">
                            <div className="profile-avatar-md bg-gradient-to-br from-green-300 to-green-100"></div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4">
                            <h2 className="profile-title truncate">{trimmedDomainName(name)}</h2>
                            <VerificationBadge className="self-start sm:self-auto" />
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="card-standard">
                    <h2 className="section-subtitle">Addresses</h2>

                    <div className="address-display">
                        <svg className="w-5 h-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.944 17.97L4.58 13.62L11.943 24L19.313 13.62L11.944 17.97Z" fill="#343434"/>
                            <path d="M11.943 0L4.58 12.223L11.943 16.573L19.313 12.223L11.943 0Z" fill="#8C8C8C"/>
                        </svg>
                        <span className="font-mono text-md mr-2">{addressFormatted}</span>
                        <button className="text-gray-400">
                            {/*<MoreVertical size={16} className="icon-action-xs" />*/}
                        </button>
                    </div>

                    <div className="section-link mb-4">
                        <h2 className="section-subtitle mb-0">Ownership</h2>
                        <span className="text-blue-500 mx-2">→</span>
                        <Link to={`/profile/${name}/ownership`} className="btn-link text-sm">View</Link>
                    </div>

                    <div className="tag-section pb-4">
                        <div className="tag-box">
                            <span className="label mr-3">manager</span>
                            <span className="value">{addressFormatted}</span>
                            <button className="text-gray-400 ml-3">
                                {/*<MoreVertical size={16} className="icon-action-xs" />*/}
                            </button>
                        </div>

                        <div className="tag-box">
                            <span className="label mr-3">owner</span>
                            <span className="value">{addressFormatted}</span>
                            <button className="text-gray-400 ml-3">
                                {/*<MoreVertical size={16} className="icon-action-xs" />*/}
                            </button>
                        </div>

                        <div className="tag-box">
                            <span className="label mr-3">expiry</span>
                            <span className="value">{expiry}</span>
                            <button className="text-gray-400 ml-3">
                                {/*<Copy size={16} className="icon-action-xs" />*/}
                            </button>
                        </div>

                        <div className="tag-box">
                            <span className="label mr-3">parent</span>
                            <span className="value">eth</span>
                            <button className="text-gray-400 ml-3">
                                {/*<MoreVertical size={16} className="icon-action-xs" />*/}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
    );
};
