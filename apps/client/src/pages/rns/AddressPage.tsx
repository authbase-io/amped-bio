import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { useReverseLookup } from '@/hooks/rns/useReverseLookup';
import { useOwnerDetail } from '@/hooks/rns/useOwnerDetail';
import { domainName, trimmedDomainName } from "@/utils/rns";

const AddressPage = () => {
    const params = useParams();
    const address = typeof params.name === 'string' && params.name.startsWith('0x') ? params.name : '';

    const { name, fullName } = useReverseLookup(address as `0x${string}`);
    const { expiryDate } = useOwnerDetail(name);

    // State for expiry filter and search
    const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);
    const [expiryFilter, setExpiryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const dropdownRef = useRef(null);

    // Handle expiry filter selection
    const handleExpiryFilter = (filter: string) => {
        setExpiryFilter(filter);
        setShowExpiryDropdown(false);
    };

    const shouldShowDomain = () => {
        if (!name) return false;

        // Handle expiry filtering
        if (expiryFilter === 'expired' && !expiryDate?.isExpired) return false;
        if (expiryFilter === 'active' && expiryDate?.isExpired) return false;

        if (searchQuery && !fullName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    };


    const formatAddress = (addr: string) => {
        if (!addr) return '';
        const start = addr.substring(0, 6);
        const end = addr.substring(addr.length - 3);
        return `${start}...${end}`;
    };

    useEffect(() => {
            const handleClickOutside = (event:MouseEvent) => {
                if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
                    setShowExpiryDropdown(false);
                }
            };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="content-container space-y-4">
            {/* Profile Header Card */}
            <div className="card-profile">
                <div className="profile-header-indigo">
                    <div className="profile-avatar-bottom">
                        <div className="profile-avatar-lg bg-gradient-to-br from-[#7FFFD4] to-[#98FB98]" />
                    </div>
                </div>

                <div className="profile-content-with-avatar">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-4 sm:gap-0">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{trimmedDomainName(name) || name}</h1>
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => navigator.clipboard.writeText(domainName(name))}
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-blue-500 text-sm">
                                {formatAddress(address)}
                            </div>
                        </div>
                        {name && (
                            <Link
                                to={`/profile/${name}`}
                                className="bg-blue-50 text-blue-500 px-6 py-2 rounded-full hover:bg-blue-100 transition font-medium"
                            >
                                View Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-md">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExpiryDropdown(!showExpiryDropdown);
                            }}
                        >
                            <span>
                                {expiryFilter === 'all' && 'All Domains'}
                                {expiryFilter === 'active' && 'Active Domains'}
                                {expiryFilter === 'expired' && 'Expired Domains'}
                            </span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {/* Expiry Dropdown */}
                        {showExpiryDropdown && (
                            <div
                                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                            >
                                <ul className="py-1">
                                    <li
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${expiryFilter === 'all' ? 'bg-blue-50 text-blue-500' : 'text-gray-700'}`}
                                        onClick={() => {
                                            handleExpiryFilter('all');
                                        }}
                                    >
                                        All Domains
                                    </li>
                                    <li
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${expiryFilter === 'active' ? 'bg-blue-50 text-blue-500' : 'text-gray-700'}`}
                                        onClick={() => {
                                            handleExpiryFilter('active');
                                        }}
                                    >
                                        Active Domains
                                    </li>
                                    <li
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${expiryFilter === 'expired' ? 'bg-blue-50 text-blue-500' : 'text-gray-700'}`}
                                        onClick={() => {
                                            handleExpiryFilter('expired');
                                        }}
                                    >
                                        Expired Domains
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search domains"
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Names List Card */}
            {name && shouldShowDomain() && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-300"></div>
                                <div>
                                    <div className="flex items-center">
                                        <span className="text-gray-900 font-bold">{fullName || name}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {expiryDate?.isExpired ? 'Expired' : `Expires on ${expiryDate?.date || 'unknown'}`}
                                    </p>
                                </div>
                            </div>
                            <span className="px-4 py-1 bg-blue-50 text-blue-500 rounded-full text-sm font-medium">Owner</span>
                        </div>
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {(name && !shouldShowDomain()) && (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <p className="text-gray-500">
                        {searchQuery
                            ? `No domains found matching "${searchQuery}"`
                            : expiryFilter === 'active'
                                ? "No active domains found"
                                : expiryFilter === 'expired'
                                    ? "No expired domains found"
                                    : "No domains found"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddressPage;
