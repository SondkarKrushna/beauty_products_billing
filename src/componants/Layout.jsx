import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#FFF9FC]">
            
            {/* 🔹 Overlay (Mobile Only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 🔹 Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 z-50
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static
                `}
            >
                <Sidebar setIsOpen={setIsOpen} />
            </div>

            {/* 🔹 Main Content */}
            <div className="flex-1 flex flex-col">
                
                {/* Navbar */}
                <div className="fixed top-0 left-0 right-0 lg:left-64 z-30">
                    <Navbar setIsOpen={setIsOpen} />
                </div>

                {/* Page Content */}
                <main className="mt-16 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;