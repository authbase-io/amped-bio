import React, {useState} from "react";
import {
    Calendar,
    ChevronDown,
    HelpCircle,
    User,
} from "lucide-react";
import {useAccount} from "wagmi";
// import {GRACE_PERIOD} from "@/config/constants";
import useGetAllRegisteredNames from "@/hooks/rns/useGetAllRegisteredNames";
import {Link} from "react-router-dom";
import { Name } from "@/types/rns/name";

const NamesList = () => {
    const {address, isConnected} = useAccount();
    const {isFetching, names, error: subgraphError} = useGetAllRegisteredNames(address, isConnected);

    const [sortType, setSortType] = useState<"name" | "expiry">("expiry");
    const [isOpen, setIsOpen] = useState(false);

    const getRemainingTime = (expires: string): string => {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresTime = Number(expires);

        if (expiresTime < currentTime) return "Expired";

        const getExpiryDate = new Date(expiresTime * 1000);
        console.log(getExpiryDate.toISOString());

        const {days, months, years} = getDifference(getExpiryDate);

        return years > 0
            ? `Expires in ${years} year${years > 1 ? "s" : ""}`
            : months > 0
                ? `Expires in ${months} month${months > 1 ? "s" : ""}`
                : days > 0
                    ? `Expires in ${days} day${days > 1 ? "s" : ""}`
                    : "Expiring in 24 hours";
    };

    function getDifference(expiryDate: Date) {
        const currentDate = new Date();
        let years = expiryDate.getFullYear() - currentDate.getFullYear();
        let months = expiryDate.getMonth() - currentDate.getMonth();
        let days = expiryDate.getDate() - currentDate.getDate();

        if (days < 0) {
            months -= 1;
            const previousMonth = new Date(
                expiryDate.getFullYear(),
                expiryDate.getMonth(),
                0,
            );
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return {
            years,
            months,
            days,
        };
    }

    const isExpired = (expires: string) => {
        const expiry = getRemainingTime(expires);
        return expiry == "Expired";
    }

    const sortedNames = !names ? [] : [...names].sort((a: Name, b: Name) => {
        if (sortType === "name") {
            return a.name.localeCompare(b.name);
        } else {
            return Number(b.expiryDateWithGrace) - Number(a.expiryDateWithGrace)
        }
    });


    return (
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Names</h1>

            {/* Info Message */}
            <div className="bg-white rounded-lg sm:rounded-xl border mb-4 p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1">
                            Some names may not appear
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                            Some names may not appear immediately. The list updates periodically, so check back later if
                            a name is missing. You can still search for specific names directly.
                        </p>
                    </div>

                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-lg sm:rounded-xl border mb-4">
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                className="flex items-center justify-between w-40 px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                    <span className="flex items-center">
                        {sortType === "expiry" ? <Calendar className="w-4 h-4 mr-2"/> :
                            <User className="w-4 h-4 mr-2"/>} {sortType}
                    </span>
                                <ChevronDown className="w-4 h-4"/>
                            </button>
                            {isOpen && (
                                <ul className="absolute w-40 mt-1 bg-white border rounded-lg shadow-lg">
                                    <li
                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setSortType("expiry");
                                            setIsOpen(false);
                                        }}
                                    >
                                        <Calendar className="w-4 h-4 mr-2"/>
                                        expiry
                                    </li>
                                    <li
                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setSortType("name");
                                            setIsOpen(false);
                                        }}
                                    >
                                        <User className="w-4 h-4 mr-2"/>
                                        name
                                    </li>

                                </ul>
                            )}
                        </div>
                    </div>

                    {/* <div className="w-full sm:w-auto sm:ml-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 pl-9 h-9 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}
                </div>
            </div>

            {/* Names List */}
            <div className="bg-white rounded-lg sm:rounded-xl border">
                {/* Single Name Container */}
                {sortedNames.length ? (
                    sortedNames.map((item) => (
                        <Link
                            to={isExpired(item.expiryDateWithGrace) ? `/register/${item.labelName}` : `/profile/${item.labelName}`}
                            key={item.name}
                            className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400"/>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium truncate">{item.labelName}</span>
                                    <span className="text-gray-500 flex-shrink-0">{import.meta.env.VITE_DOMAIN_SUFFIX || '.revotest.eth'}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {getRemainingTime(item.expiryDateWithGrace)}
                                </div>
                            </div>
                            <span className="text-blue-500 flex-shrink-0"></span>
                        </Link>
                    ))
                ) : isConnected ? (
                    <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex-1 min-w-0 text-center">
                            {isFetching ? "Getting Details" : subgraphError == null ? "No Registered Names": "Error While Fetching Details"}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex-1 min-w-0 text-center">
                            Please Connect Wallet
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NamesList;
