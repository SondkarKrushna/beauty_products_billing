// import React, { useState, useEffect, useMemo } from "react";
// import { BsCart2, BsFillFilterSquareFill } from "react-icons/bs";
// import { GrDocumentText } from "react-icons/gr";
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
//                 className="bg-white rounded-lg p-4 w-48 shadow-lg animate-fadeIn"
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

// const Invoices = () => {
//     const { data, isLoading } = useGetAllinvoiceQuery();
//     const [allInvoices, setAllInvoices] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [activeCard, setActiveCard] = useState("total");
//     const [dayFilter, setDayFilter] = useState("all");
//     const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

//     // ✅ Format invoice data
//     useEffect(() => {
//         if (data?.data?.length > 0) {
//             const formatted = data.data.map((inv) => {
//                 const created = new Date(inv.createdAt);
//                 const date = created.toLocaleDateString("en-IN");
//                 const time = created.toLocaleTimeString("en-IN", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 });

//                 return {
//                     number: inv.bill_number || inv._id.slice(-6).toUpperCase(),
//                     customer: inv.customer_name,
//                     date,
//                     time,
//                     amount: inv.total_amount,
//                     payment: inv.payment_method,
//                     status: "Paid",
//                     createdAt: created,
//                     Invoice: "View",
//                 };
//             });
//             setAllInvoices(formatted.sort((a, b) => b.createdAt - a.createdAt));
//         }
//     }, [data]);

//     // ✅ Filter by today / yesterday / all
//     const filteredByDate = useMemo(() => {
//         if (dayFilter === "all") return allInvoices;

//         const today = new Date();
//         const todayStr = today.toLocaleDateString("en-IN");

//         return allInvoices.filter((inv) => {
//             const invDateStr = new Date(inv.createdAt).toLocaleDateString("en-IN");

//             if (dayFilter === "today") return invDateStr === todayStr;

//             if (dayFilter === "yesterday") {
//                 const yesterday = new Date();
//                 yesterday.setDate(today.getDate() - 1);
//                 const yesterdayStr = yesterday.toLocaleDateString("en-IN");
//                 return invDateStr === yesterdayStr;
//             }

//             return true;
//         });
//     }, [allInvoices, dayFilter]);

//     // ✅ Search filter
//     const filteredData = useMemo(() => {
//         const baseData =
//             activeCard === "today"
//                 ? filteredByDate.filter(
//                     (i) => i.date === new Date().toLocaleDateString("en-IN")
//                 )
//                 : filteredByDate;

//         if (!searchTerm.trim()) return baseData;

//         return baseData.filter((item) =>
//             Object.values(item).some((val) =>
//                 String(val).toLowerCase().includes(searchTerm.toLowerCase())
//             )
//         );
//     }, [activeCard, filteredByDate, searchTerm]);

//     // ✅ Count today's invoices
//     const todayCount = useMemo(() => {
//         const today = new Date().toLocaleDateString("en-IN");
//         return allInvoices.filter((i) => i.date === today).length;
//     }, [allInvoices]);

//     const cards = [
//         { icon: <GrDocumentText />, label: "Today's Invoice", value: todayCount, key: "today" },
//         { icon: <GrDocumentText />, label: "Total Invoice", value: allInvoices.length, key: "total" },
//     ];

//     // ✅ Loading shimmer
//     if (isLoading) {
//         return (
//             <div className="p-3 w-full grid gap-6 animate-pulse">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//                     {[...Array(2)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="h-[106px] flex items-center gap-4 px-5 rounded-xl border border-pink-100 bg-white"
//                         >
//                             <div className="w-14 h-14 rounded-full bg-gray-300"></div>
//                             <div className="flex flex-col flex-1 gap-2">
//                                 <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                                 <div className="h-6 bg-gray-300 rounded w-1/2"></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="bg-white border border-pink-100 rounded-lg w-full p-3 mt-5">
//                     <div className="space-y-3">
//                         {[...Array(5)].map((_, i) => (
//                             <div key={i} className="h-10 bg-gray-200 rounded-md"></div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-3 w-full grid gap-6">
//             {/* Header Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//                 {cards.map((card) => (
//                     <div
//                         key={card.key}
//                         onClick={() => setActiveCard(card.key)}
//                         className={`cursor-pointer rounded-xl shadow-md border border-pink-100 h-[106px] flex items-center gap-4 px-5 transition-all duration-200 ${activeCard === card.key
//                                 ? "bg-[#FF007B]"
//                                 : "bg-white hover:bg-pink-50"
//                             }`}
//                     >
//                         <div
//                             className={`w-14 h-14 rounded-full flex justify-center items-center text-2xl shadow-md ${activeCard === card.key
//                                     ? "bg-white text-[#FF007B]"
//                                     : "bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white"
//                                 }`}
//                         >
//                             {card.icon}
//                         </div>
//                         <div className="flex flex-col">
//                             <span
//                                 className={`text-sm font-semibold ${activeCard === card.key ? "text-white" : "text-gray-500"
//                                     }`}
//                             >
//                                 {card.label}
//                             </span>
//                             <span
//                                 className={`text-2xl font-semibold ${activeCard === card.key ? "text-white" : "text-gray-800"
//                                     }`}
//                             >
//                                 {card.value}
//                             </span>
//                         </div>
//                     </div>
//                 ))}

//                 {/* Create Invoice + Search + Filter */}
//                 <div className="mt-1">
//                     <Link
//                         to="/app/createInvoices"
//                         className="flex gap-3 w-full sm:w-52 h-10 bg-gradient-to-r from-[#99004A] to-[#FF007B] px-4 rounded-md items-center justify-center"
//                     >
//                         <BsCart2 className="text-white text-lg sm:text-xl" />
//                         <span className="text-white font-semibold text-sm sm:text-base">
//                             Create Invoice
//                         </span>
//                     </Link>

//                     <div className="flex">
//                         {/* Search */}
//                         <div className="flex bg-white rounded-full px-3 mt-4 py-2 w-[212px] border border-pink-200">
//                             <FaSearch className="text-gray-500 mr-2" />
//                             <input
//                                 type="text"
//                                 placeholder="Search Invoice"
//                                 className="bg-transparent outline-none text-sm text-[#00000080] w-full"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>

//                         {/* Filter Button */}
//                         <div className="mt-5 ml-5 relative">
//                             <BsFillFilterSquareFill
//                                 className="text-pink-500 w-8 h-8 cursor-pointer"
//                                 onClick={() => setIsFilterModalOpen(true)}
//                             />
//                             {isFilterModalOpen && (
//                                 <FilterModal
//                                     onSelect={(option) => {
//                                         setDayFilter(option);
//                                         setIsFilterModalOpen(false);
//                                     }}
//                                     onClose={() => setIsFilterModalOpen(false)}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white border border-[#FDCDE4] rounded-lg w-full p-3">
//                 <span className="text-xl font-medium mb-2 block">
//                     {dayFilter === "today"
//                         ? "Today's Invoices"
//                         : dayFilter === "yesterday"
//                             ? "Yesterday's Invoices"
//                             : "All Invoices"}
//                 </span>

//                 <div className="overflow-x-auto w-full">
//                     <table className="w-full text-sm border-collapse">
//                         <thead>
//                             <tr className="bg-[#FF007B1A] text-[#000] h-10">
//                                 <th className="px-3 py-2 text-left">Invoice No</th>
//                                 <th className="px-3 py-2 text-left">Customer</th>
//                                 <th className="px-3 py-2 text-left">Date / Time</th>
//                                 <th className="px-3 py-2 text-left">Amount</th>
//                                 <th className="px-3 py-2 text-left">Payment</th>
//                                 <th className="px-3 py-2 text-left">Status</th>
//                                 <th className="px-3 py-2 text-left">Invoice</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredData.length > 0 ? (
//                                 filteredData.map((item, i) => (
//                                     <tr
//                                         key={i}
//                                         className="border-b border-gray-200 hover:bg-[#FFF5FA] transition"
//                                     >
//                                         <td className="py-2 px-3">{item.number}</td>
//                                         <td className="py-2 px-3">{item.customer}</td>
//                                         <td className="py-2 px-3 leading-tight">
//                                             {item.date}
//                                             <br />
//                                             <span className="text-gray-500 text-xs">{item.time}</span>
//                                         </td>
//                                         <td className="py-2 px-3 font-medium">₹{item.amount}</td>
//                                         <td className="py-2 px-3 capitalize">{item.payment}</td>
//                                         <td className="py-2 px-3 text-[#028322] font-semibold">
//                                             {item.status}
//                                         </td>
//                                         <td className="py-2 px-3 text-[#FF007B] cursor-pointer font-semibold hover:underline">
//                                             {item.Invoice}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan="7"
//                                         className="text-center py-5 text-gray-500 font-medium"
//                                     >
//                                         No invoices found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Invoices;


import React, { useState, useEffect, useMemo } from "react";
import { BsCart2, BsFillFilterSquareFill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useGetAllinvoiceQuery } from "../redux/apis/adminApi";
import { FaSearch } from "react-icons/fa";
import Bill from "../pages/Bill";
import { useLocation } from "react-router-dom";

const FilterModal = ({ onSelect, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-4 w-48 shadow-lg animate-fadeIn"
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

const Invoices = () => {
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data, isLoading,refetch } = useGetAllinvoiceQuery({ page, limit });

    const [allInvoices, setAllInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const location = useLocation();
    const [activeCard, setActiveCard] = useState(location.state?.filter || "all");

    const [dayFilter, setDayFilter] = useState("all");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const totalPages = data?.pagination?.totalPages || 1;
    const currentPage = data?.pagination?.currentPage || page;

    useEffect(() => {
        if (data?.data?.length > 0) {
            const formatted = data.data.map((inv) => {
                const created = new Date(inv.createdAt);
                const date = created.toLocaleDateString("en-IN");
                const time = created.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return {
                    _id: inv._id,
                    number: inv.bill_number || inv._id.slice(-6).toUpperCase(),
                    customer: inv.customer_name,
                    date,
                    time,
                    amount: inv.total_amount,
                    payment: inv.payment_method,
                    status: "Paid",
                    createdAt: created,
                    Invoice: "View",
                };
            });

            setAllInvoices(formatted.sort((a, b) => b.createdAt - a.createdAt));
        } else {
            setAllInvoices([]);
        }
    }, [data]);

    const filteredByDate = useMemo(() => {
        if (dayFilter === "all") return allInvoices;

        const today = new Date();
        const todayStr = today.toLocaleDateString("en-IN");

        return allInvoices.filter((inv) => {
            const invDateStr = new Date(inv.createdAt).toLocaleDateString("en-IN");

            if (dayFilter === "today") return invDateStr === todayStr;

            if (dayFilter === "yesterday") {
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                const yesterdayStr = yesterday.toLocaleDateString("en-IN");
                return invDateStr === yesterdayStr;
            }
            return true;
        });
    }, [allInvoices, dayFilter]);

    // ✅ Search filter
    const filteredData = useMemo(() => {
        const baseData =
            activeCard === "today"
                ? filteredByDate.filter(
                    (i) => i.date === new Date().toLocaleDateString("en-IN")
                )
                : filteredByDate;

        if (!searchTerm.trim()) return baseData;

        return baseData.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [activeCard, filteredByDate, searchTerm]);

    // ✅ Count today's invoices
    const todayCount = useMemo(() => {
        const today = new Date().toLocaleDateString("en-IN");
        return allInvoices.filter((i) => i.date === today).length;
    }, [allInvoices]);

    const cards = [
  {
    icon: <GrDocumentText />,
    label: "Today's Invoice",
    value: data?.stats?.todayInvoices || 0,
    key: "today",
  },
  {
    icon: <GrDocumentText />,
    label: "Total Invoice",
    value: data?.stats?.totalInvoices || 0,
    key: "all",
  },
];
    
    // ✅ Loading shimmer
    if (isLoading) {
        return (
            <div className="p-3 w-full grid gap-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[106px] flex items-center gap-4 px-5 rounded-xl border border-pink-100 bg-white"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
   
    return (
        <div className="p-3 w-full grid gap-6">
            {/* Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {cards.map((card) => (
                    <div
                        key={card.key}
                        onClick={() => setActiveCard(card.key)}
                        className={`cursor-pointer rounded-xl shadow-md border border-pink-100 h-[106px] flex items-center gap-4 px-5 transition-all duration-200 ${activeCard === card.key
                            ? "bg-[#FF007B]"
                            : "bg-white hover:bg-pink-50"
                            }`}
                    >
                        <div
                            className={`w-14 h-14 rounded-full flex justify-center items-center text-2xl shadow-md ${activeCard === card.key
                                ? "bg-white text-[#FF007B]"
                                : "bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white"
                                }`}
                        >
                            {card.icon}
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`text-sm font-semibold ${activeCard === card.key ? "text-white" : "text-gray-500"
                                    }`}
                            >
                                {card.label}
                            </span>
                            <span
                                className={`text-2xl font-semibold ${activeCard === card.key ? "text-white" : "text-gray-800"
                                    }`}
                            >
                                {card.value}
                            </span>
                        </div>
                    </div>
                ))}
                
                <div className="mt-2 space-y-4 sm:space-y-1">
                    <div className="flex items-center gap-3  w-full mt-4">
                        {/* Search */}
                        <div className="flex bg-white rounded-full px-4 py-2 w-full border border-pink-200 items-center">
                            <FaSearch className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search Invoice"
                                className="bg-transparent outline-none text-sm text-[#00000080] w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                            
                        {/* Filter Button */}
                        <div className="relative flex items-center">
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
                    
                    <Link
                        to="/app/createInvoices"
                        className="flex gap-3 mt-2 w-full sm:w-52 h-10 bg-gradient-to-r from-[#99004A] to-[#FF007B] px-4 rounded-md items-center justify-center"
                    >
                        <BsCart2 className="text-white text-lg sm:text-xl" />
                        <span className="text-white font-semibold text-sm sm:text-base">
                            Create Invoice
                        </span>
                    </Link>

                </div>
            </div>

            {/* Table Section */}
<div className="bg-white border border-[#FDCDE4] rounded-lg w-full p-3">
  <span className="text-xl font-medium mb-2 block">
    {dayFilter === "today"
      ? "Today's Invoices"
      : dayFilter === "yesterday"
      ? "Yesterday's Invoices"
      : "All Invoices"}
  </span>

  {/* ================= DESKTOP TABLE (UNCHANGED) ================= */}
  <div className="hidden sm:block overflow-x-auto w-full">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-[#FF007B1A] text-[#000] h-10">
          <th className="px-3 py-2 text-left">Invoice No</th>
          <th className="px-3 py-2 text-left">Customer</th>
          <th className="px-3 py-2 text-left">Date / Time</th>
          <th className="px-3 py-2 text-left">Amount</th>
          <th className="px-3 py-2 text-left">Payment</th>
          <th className="px-3 py-2 text-left">Status</th>
          <th className="px-3 py-2 text-left">Invoice</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 hover:bg-[#FFF5FA] transition"
            >
              <td className="py-2 px-3">{item.number}</td>
              <td className="py-2 px-3">{item.customer}</td>
              <td className="py-2 px-3 leading-tight">
                {item.date}
                <br />
                <span className="text-gray-500 text-xs">
                  {item.time}
                </span>
              </td>
              <td className="py-2 px-3 font-medium">
                ₹{item.amount}
              </td>
              <td className="py-2 px-3 capitalize">
                {item.payment}
              </td>
              <td className="py-2 px-3 text-[#028322] font-semibold">
                {item.status}
              </td>
              <td
                className="py-2 px-3 text-[#FF007B] cursor-pointer hover:underline"
                onClick={() => setSelectedInvoice(item._id)}
              >
                View
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="7"
              className="text-center py-5 text-gray-500 font-medium"
            >
              No invoices found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* ================= MOBILE CARD LAYOUT ================= */}
  <div className="sm:hidden space-y-4">
    {filteredData.length > 0 ? (
      filteredData.map((item, i) => (
        <div
          key={i}
          className="bg-[#FFF5FA] border border-[#FDCDE4] rounded-xl p-4 shadow-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">
              {item.number}
            </h3>
            <span className="text-[#028322] font-semibold text-sm">
              {item.status}
            </span>
          </div>

          {/* Customer */}
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Customer:</span>{" "}
            {item.customer}
          </div>

          {/* Date */}
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Date:</span>{" "}
            {item.date}
          </div>

          <div className="text-xs text-gray-500 mb-2">
            {item.time}
          </div>

          {/* Amount */}
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Amount:</span> ₹{item.amount}
          </div>

          {/* Payment */}
          <div className="text-sm text-gray-600 mb-3 capitalize">
            <span className="font-medium">Payment:</span>{" "}
            {item.payment}
          </div>

          {/* View Button */}
          <button
            onClick={() => setSelectedInvoice(item._id)}
            className="w-full py-2 text-sm bg-[#FF007B] text-white rounded-md"
          >
            View Invoice
          </button>
        </div>
      ))
    ) : (
      <div className="text-center py-5 text-gray-500 font-medium">
        No invoices found
      </div>
    )}
  </div>

  {/* ================= PAGINATION (UNCHANGED) ================= */}
  <div className="flex justify-center items-center gap-4 mt-4">
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-md border ${
        currentPage === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#FF007B] text-white hover:bg-pink-600"
      }`}
    >
      Previous
    </button>

    <span className="font-semibold">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setPage((p) => p + 1)}
      disabled={currentPage >= totalPages}
      className={`px-4 py-2 rounded-md border ${
        currentPage >= totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#FF007B] text-white hover:bg-pink-600"
      }`}
    >
      Next
    </button>
  </div>
</div>
            {selectedInvoice && (
                <Bill
                    invoiceId={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
};

export default Invoices;

