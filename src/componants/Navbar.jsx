import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import LogoutDropdown from "./LogoutDropdown";

const Navbar = ({ setIsOpen }) => {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            const date = now.toLocaleDateString("en-GB");
            const time = now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });

            setCurrentDate(date);
            setCurrentTime(time);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const closeDropdown = () => setShowDropdown(false);
        window.addEventListener("click", closeDropdown);
        return () => window.removeEventListener("click", closeDropdown);
    }, []);

    return (
        <div
            className="w-full backdrop-blur-md"
            style={{ backgroundColor: "#FFD7EA75" }}
        >
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-[60px] sm:h-[71px]">

                {/* 🔹 Left Section */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        className="lg:hidden text-xl sm:text-2xl text-[#FF007B]"
                        onClick={() => setIsOpen(true)}
                    >
                        <FaBars />
                    </button>

                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#FF007B] whitespace-nowrap">
                        Dashboard
                    </h2>
                </div>

                {/* 🔹 Right Section */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-gray-700 font-medium">

                    {/* Date */}
                    <div className="hidden sm:flex items-center gap-1 md:gap-2 text-xs sm:text-sm md:text-base">
                        <FaCalendarAlt className="text-[#FF007B]" />
                        <span>{currentDate}</span>
                    </div>

                    {/* Time */}
                    <div className="hidden sm:flex items-center gap-1 md:gap-2 text-xs sm:text-sm md:text-base">
                        <IoTime className="text-[#FF007B]" />
                        <span>{currentTime}</span>
                    </div>

                    {/* User */}
                    <div className="relative">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base cursor-pointer"
                            style={{ backgroundColor: "#FFCCE5" }}
                        >
                            <FaUserCircle className="text-[#FF007B] text-2xl sm:text-2xl md:text-3xl" />
                            <span className="hidden sm:inline font-medium text-gray-800 whitespace-nowrap">
                                Cashier Admin
                            </span>
                        </div>

                        {showDropdown && (
                            <LogoutDropdown />
                        )}
                    </div>
                </div>
            </div>

            {/* 📱 Mobile Date & Time Row */}
            <div className="sm:hidden flex justify-center gap-4 pb-2 text-xs text-gray-700">
                <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[#FF007B]" />
                    <span>{currentDate}</span>
                </div>
                <div className="flex items-center gap-1">
                    <IoTime className="text-[#FF007B]" />
                    <span>{currentTime}</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;