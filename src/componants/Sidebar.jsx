import React, { useMemo } from "react";
import {
    FaHome,
    FaFileInvoice,
    FaMoneyBill,
    FaBoxOpen,
    FaTimes
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import sidebarimage from "../assets/sidebarlogo.png";

const Sidebar = ({ setIsOpen }) => {
    const location = useLocation();

    const menuItems = useMemo(() => [
        { name: "Dashboard", path: "/app", icon: <FaHome /> },
        { name: "Invoices", path: "/app/invoices", icon: <FaFileInvoice /> },
        { name: "Revenue", path: "/app/revenue", icon: <FaMoneyBill /> },
        { name: "Products", path: "/app/products", icon: <FaBoxOpen /> },
    ], []);

    const isActive = (path) =>
        path === "/app"
            ? location.pathname === "/app"
            : location.pathname.startsWith(path);

    const getClasses = (path) =>
        `flex items-center w-[237px] h-[53px] p-3 rounded-r-full cursor-pointer transition-all ${
            isActive(path)
                ? "bg-[#FF007B] text-white"
                : "bg-white/20 hover:bg-white/30 text-white"
        }`;

    return (
        <aside
            className="flex flex-col text-white w-[246px] h-screen rounded-tr-3xl rounded-br-3xl shadow-lg overflow-y-auto scrollbar-none relative pb-6"
            style={{
                background:
                    "linear-gradient(180.36deg, #280F22 33.41%, #FF007B 180.86%)",
            }}
        >
            {/* ❌ Close Button (Mobile Only) */}
            <button
                className="absolute top-4 right-4 text-xl lg:hidden"
                onClick={() => setIsOpen(false)}
            >
                <FaTimes />
            </button>

            {/* 🌸 Logo Section */}
            <div className="flex flex-col items-center mb-4 mt-4">
                <img className="h-20" src={sidebarimage} alt="logo" />
                <div className="tracking-wider font-serif">S O N A L</div>
                <div className="text-sm text-white/80">Cosmetics</div>
            </div>

            {/* 🧭 Navigation */}
            <nav className="flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)} // close on mobile click
                                className={getClasses(item.path)}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;