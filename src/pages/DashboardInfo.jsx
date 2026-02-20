// import React, { useMemo, useState } from "react";
// import { GrDocumentText } from "react-icons/gr";
// import { PiHandbagSimpleBold } from "react-icons/pi";
// import { TbMoneybag } from "react-icons/tb";
// import { BsCart2, BsFillFilterSquareFill } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import { useGetAllinvoiceQuery } from "../redux/apis/adminApi";
// import { FaSearch } from "react-icons/fa";

// const FilterModal = ({ onSelect, onClose }) => {
//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-white rounded-lg p-4 w-48 shadow-lg"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <h3 className="text-gray-700 font-semibold mb-2 text-center">
//                     Filter Invoices
//                 </h3>
//                 <div className="flex flex-col gap-2">
//                     {["today", "yesterday", "all"].map((option) => (
//                         <button
//                             key={option}
//                             className="text-sm px-3 py-2 rounded hover:bg-pink-100 text-gray-700 transition"
//                             onClick={() => onSelect(option)}
//                         >
//                             {option.charAt(0).toUpperCase() + option.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const DashboardInfo = () => {
//     const { data, isLoading } = useGetAllinvoiceQuery();
//     const invoices = data?.data || [];

//     const [searchTerm, setSearchTerm] = useState("");
//     const [dayFilter, setDayFilter] = useState("all");
//     const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

//     // ✅ Sort invoices by newest first (latest createdAt)
//     const sortedInvoices = useMemo(() => {
//         return [...invoices].sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//     }, [invoices]);

//     // ✅ Filter invoices by date (today/yesterday/all) and search term
//     const filteredInvoices = useMemo(() => {
//         let result = sortedInvoices;

//         const todayDate = new Date().toISOString().split("T")[0];
//         const yesterdayDate = new Date(Date.now() - 86400000)
//             .toISOString()
//             .split("T")[0];

//         if (dayFilter === "today") {
//             result = result.filter(
//                 (inv) =>
//                     new Date(inv.createdAt).toISOString().split("T")[0] === todayDate
//             );
//         } else if (dayFilter === "yesterday") {
//             result = result.filter(
//                 (inv) =>
//                     new Date(inv.createdAt).toISOString().split("T")[0] ===
//                     yesterdayDate
//             );
//         }

//         if (searchTerm.trim()) {
//             result = result.filter((inv) => {
//                 const invoiceNo = inv.bill_number || "";
//                 const customerName = inv.customer_name || "";
//                 const date = new Date(inv.createdAt).toLocaleDateString("en-IN");

//                 return (
//                     invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     date.includes(searchTerm)
//                 );
//             });
//         }

//         return result;
//     }, [sortedInvoices, dayFilter, searchTerm]);

//     // ✅ Summary Calculations
//     const { todayInvoicesCount, totalInvoicesCount, todayRevenue, totalRevenue } =
//         useMemo(() => {
//             const todayDate = new Date().toISOString().split("T")[0];

//             const todayInvoices = sortedInvoices.filter(
//                 (inv) =>
//                     new Date(inv.createdAt).toISOString().split("T")[0] === todayDate
//             );

//             const todayRevenue = todayInvoices.reduce(
//                 (sum, inv) => sum + Number(inv.total_amount || 0),
//                 0
//             );

//             const totalRevenue = sortedInvoices.reduce(
//                 (sum, inv) => sum + Number(inv.total_amount || 0),
//                 0
//             );

//             return {
//                 todayInvoicesCount: todayInvoices.length,
//                 totalInvoicesCount: sortedInvoices.length,
//                 todayRevenue,
//                 totalRevenue,
//             };
//         }, [sortedInvoices]);

//     if (isLoading) {
//         return (
//             <div className="w-full min-h-screen p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[...Array(5)].map((_, i) => (
//                     <div
//                         key={i}
//                         className="bg-white rounded-xl shadow-md h-[106px] flex items-center gap-4 px-5 animate-pulse"
//                     >
//                         <div className="w-14 h-14 rounded-full bg-gray-300"></div>
//                         <div className="flex flex-col flex-1 gap-2">
//                             <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                             <div className="h-6 bg-gray-300 rounded w-1/2"></div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="w-full min-h-screen bg-[#FFF9FC] px-3 sm:px-6 md:px-10 py-4 overflow-hidden">
//             {/* Cards Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
//                 {[
//                     { icon: <GrDocumentText />, label: "Today's Invoice", value: todayInvoicesCount },
//                     { icon: <GrDocumentText />, label: "Total Invoice", value: totalInvoicesCount },
//                     { icon: <PiHandbagSimpleBold />, label: "New Stock", value: "5" },
//                     {
//                         icon: <TbMoneybag />,
//                         label: "Today's Revenue",
//                         value: `₹ ${todayRevenue.toLocaleString("en-IN", {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                         })}`,
//                     },
//                     {
//                         icon: <TbMoneybag />,
//                         label: "Total Revenue",
//                         value: `₹ ${totalRevenue.toLocaleString("en-IN", {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                         })}`,
//                     },
//                 ].map((card, i) => (
//                     <div
//                         key={i}
//                         className="bg-white rounded-xl shadow-md shadow-pink-200 border border-pink-100 h-[106px] flex items-center gap-4 px-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
//                     >
//                         <div className="w-14 h-14 rounded-full flex justify-center items-center bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white text-2xl shadow-md">
//                             {card.icon}
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-sm text-gray-500">{card.label}</span>
//                             <span className="text-2xl font-semibold text-gray-800">{card.value}</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Buttons + Search + Filter */}
//             <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
//                 <Link to="/app/createInvoices">
//                     <div className="flex gap-3 w-48 h-10 bg-gradient-to-r from-[#99004A] to-[#FF007B] px-4 rounded-md items-center justify-center text-white font-semibold cursor-pointer">
//                         <BsCart2 className="text-2xl" />
//                         <span>Create Invoice</span>
//                     </div>
//                 </Link>

//                 <div className="flex justify-center items-center w-48 h-10 bg-[#FDCDE4] rounded-md hover:bg-gradient-to-r from-[#99004A] to-[#FF007B] transition-all cursor-pointer">
//                     <span className="text-white font-semibold">Download Invoices</span>
//                 </div>

//                 <div className="flex justify-center items-center bg-[#FDCDE4] rounded-md w-48 h-10 hover:bg-gradient-to-t from-[#99004A] to-[#FF007B] transition-all cursor-pointer">
//                     <span className="text-white font-semibold">View Invoices</span>
//                 </div>

//                 <div className="flex bg-white rounded-full px-3 py-2 w-[270px] border border-pink-200">
//                     <FaSearch className="text-gray-500 mr-2" />
//                     <input
//                         type="text"
//                         placeholder="Search Invoice"
//                         className="bg-transparent outline-none text-sm"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 <div className="mt-1 ml-2 relative">
//                     <BsFillFilterSquareFill
//                         className="text-pink-500 w-8 h-8 cursor-pointer"
//                         onClick={() => setIsFilterModalOpen(true)}
//                     />
//                     {isFilterModalOpen && (
//                         <FilterModal
//                             onSelect={(option) => {
//                                 setDayFilter(option);
//                                 setIsFilterModalOpen(false);
//                             }}
//                             onClose={() => setIsFilterModalOpen(false)}
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* Recent Sales Table */}
//             <div className="bg-white mt-6 border border-[#FDCDE4] rounded-lg p-4 w-full overflow-x-auto">
//                 <p className="text-xl font-medium mb-3">Recent Sales</p>
//                 <table className="w-full min-w-[600px] text-left text-sm border-collapse">
//                     <thead>
//                         <tr className="bg-[#FF007B1A] text-[#000000] h-12">
//                             <th className="ps-10 py-2">Invoice No</th>
//                             <th className="ps-10 py-2">Customer</th>
//                             <th className="ps-10 py-2">Date/Time</th>
//                             <th className="ps-10 py-2">Amount</th>
//                             <th className="ps-10 py-2">Payment</th>
//                             <th className="ps-10 py-2">Status</th>
//                             <th className="ps-10 py-2">Invoice</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInvoices.length > 0 ? (
//                             filteredInvoices.map((item, index) => {
//                                 const dateObj = new Date(item.createdAt);
//                                 const date = dateObj.toLocaleDateString("en-IN");
//                                 const time = dateObj.toLocaleTimeString("en-IN", {
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                 });

//                                 return (
//                                     <tr
//                                         key={index}
//                                         className="border-b border-gray-200 text-center hover:bg-[#FFF5FA] transition"
//                                     >
//                                         <td className="py-3">{item.bill_number || `INV-${index + 1}`}</td>
//                                         <td className="py-3">{item.customer_name || "N/A"}</td>
//                                         <td className="py-3">
//                                             {date}
//                                             <br />
//                                             {time}
//                                         </td>
//                                         <td className="py-3 font-medium">
//                                             ₹
//                                             {Number(item.total_amount || 0).toLocaleString("en-IN", {
//                                                 minimumFractionDigits: 2,
//                                                 maximumFractionDigits: 2,
//                                             })}
//                                         </td>
//                                         <td className="py-3 capitalize">{item.payment_method || "N/A"}</td>
//                                         <td className="py-3 text-[#028322] font-semibold">Paid</td>
//                                         <td className="py-3 text-[#FF007B] cursor-pointer hover:underline">
//                                             View
//                                         </td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="py-6 text-center text-gray-500">
//                                     No Invoices Found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default DashboardInfo;


import React, { useMemo, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { PiHandbagSimpleBold } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";
import { BsCart2, BsFillFilterSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useGetAllinvoiceQuery, useGetAllproductQuery } from "../redux/apis/adminApi";
import { useGetCountQuery } from "../redux/apis/countApi";
import { FaSearch } from "react-icons/fa";
import { IoBagSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Bill from "../pages/Bill"

const FilterModal = ({ onSelect, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-4 w-48 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-gray-700 font-semibold mb-2 text-center">
                    Filter Invoices
                </h3>
                <div className="flex flex-col gap-2">
                    {["today", "yesterday", "all"].map((option) => (
                        <button
                            key={option}
                            className="text-sm px-3 py-2 rounded hover:bg-pink-100 text-gray-700 transition"
                            onClick={() => onSelect(option)}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardInfo = () => {
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data, isLoading } = useGetAllinvoiceQuery({ page, limit });
    const { data: metadata, isLoading: loading } = useGetAllproductQuery();
    const { data: countdata, loading: isloadings } = useGetCountQuery();
    const navigate = useNavigate();
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    const invoices = data?.data || [];
    const stats = data?.stats || {};

    const [searchTerm, setSearchTerm] = useState("");
    const [dayFilter, setDayFilter] = useState("all");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const totalProducts = countdata?.data?.productCount || 0;
    const totalPages = data?.pagination?.totalPages || 1;

    const handleCardClick = (card) => {
        if (card.path) {
            navigate(card.path, {
                state: { activeTab: card.activeTab }
            });
        } else if (card.filter) {
            navigate("/app/invoices", {
                state: { filter: card.filter }
            });
        }
    };

    const sortedInvoices = useMemo(() => {
        return [...invoices].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        let result = sortedInvoices;

        const todayDate = new Date().toISOString().split("T")[0];
        const yesterdayDate = new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0];

        if (dayFilter === "today") {
            result = result.filter(
                (inv) =>
                    new Date(inv.createdAt).toISOString().split("T")[0] === todayDate
            );
        } else if (dayFilter === "yesterday") {
            result = result.filter(
                (inv) =>
                    new Date(inv.createdAt).toISOString().split("T")[0] ===
                    yesterdayDate
            );
        }

        if (searchTerm.trim()) {
            result = result.filter((inv) => {
                const invoiceNo = inv.bill_number || "";
                const customerName = inv.customer_name || "";
                const date = new Date(inv.createdAt).toLocaleDateString("en-IN");

                return (
                    invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    date.includes(searchTerm)
                );
            });
        }
        return result;
    }, [sortedInvoices, dayFilter, searchTerm]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-md shadow-pink-200 border border-pink-100 h-[106px] flex items-center gap-4 px-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-300"
                    >
                        <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                        <div className="flex flex-col flex-1 gap-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#FFF9FC] px-3 sm:px-6 md:px-10 py-4 overflow-hidden">
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
                {[
                    {
                        icon: <GrDocumentText />,
                        label: "Today's Invoices",
                        value: stats.todayInvoices ?? 0,
                        filter: "today",
                    },
                    {
                        icon: <GrDocumentText />,
                        label: "Total Invoices",
                        value: stats.totalInvoices ?? 0,
                        filter: "all",
                    },
                    {
                        icon: <TbMoneybag />,
                        label: "Today's Revenue",
                        value: `₹ ${(stats.todayAmount ?? 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`,
                        path: "/app/revenue",
                        activeTab: "today",
                    },
                    {
                        icon: <TbMoneybag />,
                        label: "Total Revenue",
                        value: `₹ ${(stats.totalAmount ?? 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`,
                        path: "/app/revenue",
                        activeTab: "total",
                    },
                    {
                        icon: <IoBagSharp />,
                        label: "Total Products",
                        value: totalProducts,
                        path: "/app/products",
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        onClick={() => handleCardClick(card)}
                        className="bg-white rounded-xl shadow-md shadow-pink-200 border border-pink-100 h-[106px] flex items-center gap-4 px-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-pink-300"
                    >
                        <div className="w-14 h-14 rounded-full flex justify-center items-center bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white text-2xl shadow-md">
                            {card.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">{card.label}</span>
                            <span className="text-2xl font-semibold text-gray-800">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons + Search + Filter */}
            <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
                {/* Left Side — Create Invoice */}
                <Link to="/app/createInvoices">
                    <div className="flex gap-3 w-48 h-10 bg-gradient-to-r from-[#99004A] to-[#FF007B] px-4 rounded-md items-center justify-center text-white font-semibold cursor-pointer">
                        <BsCart2 className="text-2xl" />
                        <span>Create Invoice</span>
                    </div>
                </Link>

                {/* Right Side — Search + Filter */}
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="flex bg-white rounded-full px-3 py-2 w-[270px] border border-pink-200 items-center">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search Invoice"
                            className="bg-transparent outline-none text-sm w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Button */}
                    <div className="relative">
                        <BsFillFilterSquareFill
                            className="text-pink-500 w-8 h-8 cursor-pointer"
                            onClick={() => setIsFilterModalOpen(true)}
                        />
                        {isFilterModalOpen && (
                            <FilterModal
                                onSelect={(option) => {
                                    setDayFilter(option);
                                    setIsFilterModalOpen(false);
                                }}
                                onClose={() => setIsFilterModalOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Sales Section */}
            <div className="bg-white mt-6 border border-[#FDCDE4] rounded-lg p-4 w-full">

                <p className="text-xl font-medium mb-3">Recent Sales</p>

                {/* ================= DESKTOP TABLE (UNCHANGED) ================= */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-[#FF007B1A] text-[#000000] h-12">
                                <th className="ps-10 py-2">Invoice No</th>
                                <th className="ps-10 py-2">Customer</th>
                                <th className="ps-10 py-2">Date/Time</th>
                                <th className="ps-10 py-2">Amount</th>
                                <th className="ps-10 py-2">Payment</th>
                                <th className="ps-10 py-2">Status</th>
                                <th className="ps-10 py-2">Invoice</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((item, index) => {
                                    const dateObj = new Date(item.createdAt);
                                    const date = dateObj.toLocaleDateString("en-IN");
                                    const time = dateObj.toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 text-center hover:bg-[#FFF5FA] transition"
                                        >
                                            <td className="py-3">{item.bill_number || `INV-${index + 1}`}</td>
                                            <td className="py-3">{item.customer_name || "N/A"}</td>
                                            <td className="py-3">
                                                {date}
                                                <br />
                                                {time}
                                            </td>
                                            <td className="py-3 font-medium">
                                                ₹{Number(item.total_amount || 0).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="py-3 capitalize">
                                                {item.payment_method || "N/A"}
                                            </td>
                                            <td className="py-3 text-[#028322] font-semibold">
                                                Paid
                                            </td>
                                            <td
                                                className="py-3 text-[#FF007B] cursor-pointer hover:underline"
                                                onClick={() => setSelectedInvoiceId(item._id)}
                                            >
                                                View
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-gray-500">
                                        No Invoices Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= MOBILE CARD LAYOUT ================= */}
                <div className="sm:hidden space-y-4">
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((item, index) => {
                            const dateObj = new Date(item.createdAt);
                            const date = dateObj.toLocaleDateString("en-IN");
                            const time = dateObj.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={index}
                                    className="bg-[#FFF5FA] border border-[#FDCDE4] rounded-xl p-4 shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.bill_number || `INV-${index + 1}`}
                                        </h3>
                                        <span className="text-[#028322] font-semibold text-sm">
                                            Paid
                                        </span>
                                    </div>

                                    {/* Customer */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">Customer:</span>{" "}
                                        {item.customer_name || "N/A"}
                                    </div>

                                    {/* Date */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">Date:</span> {date} · {time}
                                    </div>

                                    {/* Amount */}
                                    <div className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium">Amount:</span>{" "}
                                        ₹{Number(item.total_amount || 0).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>

                                    {/* Payment */}
                                    <div className="text-sm text-gray-600 mb-3">
                                        <span className="font-medium">Payment:</span>{" "}
                                        {item.payment_method || "N/A"}
                                    </div>

                                    {/* View Button */}
                                    <button
                                        onClick={() => setSelectedInvoiceId(item._id)}
                                        className="w-full py-2 text-sm bg-[#FF007B] text-white rounded-md"
                                    >
                                        View Invoice
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-6 text-center text-gray-500">
                            No Invoices Found
                        </div>
                    )}
                </div>

                {/* ================= PAGINATION (UNCHANGED) ================= */}
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md border ${page === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FF007B] text-white hover:bg-pink-600"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="font-semibold">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page >= totalPages}
                        className={`px-4 py-2 rounded-md border ${page >= totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FF007B] text-white hover:bg-pink-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
            {selectedInvoiceId && (
                <Bill
                    invoiceId={selectedInvoiceId}
                    onClose={() => setSelectedInvoiceId(null)}
                />
            )}
        </div>
    );
};

export default DashboardInfo;