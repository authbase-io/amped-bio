import React from 'react';
import { useRNSNavigation } from '@/contexts/RNSNavigationContext';

interface ProfileNavProps {
    name: string;
    activeTab?: 'details' | 'ownership' | 'more';
}

export const ProfileNav = ({ name, activeTab = 'details' }: ProfileNavProps) => {
    const { navigateToProfile, navigateToProfileOwnership, navigateToProfileMore } = useRNSNavigation();

    const navItems = [
        { label: 'Profile', tab: 'details' as const, onClick: () => navigateToProfile(name) },
        { label: 'Ownership', tab: 'ownership' as const, onClick: () => navigateToProfileOwnership(name) },
        { label: 'More', tab: 'more' as const, onClick: () => navigateToProfileMore(name) },
    ];

    return (
        <div className="mb-2 overflow-x-auto -mx-4 sm:mx-0 sm:overflow-visible">
            <nav className="flex min-w-max px-4 sm:px-0">
                {navItems.map((item) => {
                    const isActive = item.tab === activeTab;

                    return (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={isActive ? "nav-item-active" : "nav-item-inactive"}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
