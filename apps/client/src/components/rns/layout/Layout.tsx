import React from 'react';
import {Outlet} from "react-router-dom";
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <div className="bg-gray-50 overflow-x-hidden">
            <Header/>
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;
