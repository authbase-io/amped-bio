import React, {useState, useRef, useEffect} from 'react';
import {MoreHorizontal, ExternalLink, Copy, ArrowUpRight} from 'lucide-react';
import {useOwnerDetail} from "@/hooks/rns/useOwnerDetail";
import {domainName, scannerURL} from "@/utils/rns";
import { useRNSNavigation } from '@/contexts/RNSNavigationContext';

const RoleDropdown = ({name}: {name: string}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { ownerAddress } = useOwnerDetail(name);
    const { navigateToProfile, navigateToAddress } = useRNSNavigation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        {
            icon: <ArrowUpRight className="w-4 h-4"/>,
            label: 'View Profile',
            onClick: () => {
                navigateToProfile(name);
                setIsOpen(false);
            }
        },
        {
            icon: <Copy className="w-4 h-4"/>,
            label: 'Copy name',
            onClick: () => {
                navigator.clipboard.writeText(domainName(name));
                setIsOpen(false);
            }
        },
        {
            icon: <ArrowUpRight className="w-4 h-4"/>,
            label: 'View address',
            onClick: () => {
                navigateToAddress(ownerAddress.full);
                setIsOpen(false);
            }
        },
        {
            icon: <Copy className="w-4 h-4"/>,
            label: 'Copy address',
            onClick: () => {
                navigator.clipboard.writeText(ownerAddress.full);
                setIsOpen(false);
            }
        },
        {
            icon: <ExternalLink className="w-4 h-4"/>,
            label: 'View on BaseScan',
            onClick: () => {
                window.open(scannerURL('address', ownerAddress.full), '_blank');
                setIsOpen(false);
            }
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-icon"
            >
                <MoreHorizontal className="w-5 h-5 text-gray-400"/>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-900 border border-gray-700 shadow-lg z-50">
                    <div className="py-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className="dropdown-item"
                                onClick={item.onClick}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleDropdown;
