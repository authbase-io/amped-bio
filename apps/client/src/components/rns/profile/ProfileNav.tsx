import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ProfileNavProps {
    name: string;
}

export const ProfileNav = ({ name }: ProfileNavProps) => {
    const location = useLocation();
    const pathname = location.pathname;
    const basePath = `/profile/${name}`;

    const navItems = [
        { label: 'Profile', href: `/profile/${name}` },
        // { label: 'Records', href: `/profile/${name}/records` },
        { label: 'Ownership', href: `/profile/${name}/ownership` },
        // { label: 'Subnames', href: `/profile/${name}/subnames` },
        // { label: 'Permissions', href: `/profile/${name}/permissions` },
        { label: 'More', href: `/profile/${name}/more` },
    ];

    return (
        <div className="mb-2 overflow-x-auto -mx-4 sm:mx-0 sm:overflow-visible">
            <nav className="flex min-w-max px-4 sm:px-0">
                {navItems.map((item) => {
                    const isActive = item.href === basePath ? pathname === basePath : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={isActive ? "nav-item-active" : "nav-item-inactive"}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
