import React, { useState, useEffect, useMemo } from "react";
import { GrDocumentText } from "react-icons/gr";
import { useGetAllinvoiceQuery } from "../redux/apis/adminApi";
import { useLocation } from "react-router-dom";

const Revenue = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const location = useLocation();

    const { data, isLoading } = useGetAllinvoiceQuery({ page, limit });
    const invoices = data?.data || [];

    const [activeCard, setActiveCard] = useState("today");

    // ✅ Set active tab from navigation state only once on component mount
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveCard(location.state.activeTab);
        }
    }, [location.state]);

    const RevenueCardSkeleton = () => (
        <div className="rounded-xl shadow-md border border-pink-100 h-[106px] flex items-center gap-4 px-5 animate-pulse bg-white">
            <div className="w-14 h-14 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-2 w-full">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            </div>
        </div>
    );

    const TableRowSkeleton = () => (
        <tr className="border-b border-gray-200 animate-pulse">
            <td className="py-3 px-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="py-3 px-3">
                <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
            </td>
            <td className="py-3 px-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="py-3 px-3">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="py-3 px-3">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
            </td>
        </tr>
    );


    const { sortedInvoices, todayInvoices, todayRevenue, totalRevenue } = useMemo(() => {
        if (Array.isArray(invoices) && invoices.length > 0) {
            const sorted = [...invoices].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            const todayDate = new Date().toISOString().split("T")[0];
            const todays = sorted.filter((inv) => {
                const invDate = new Date(inv.createdAt).toISOString().split("T")[0];
                return invDate === todayDate;
            });

            const total = data?.stats?.totalAmount;
            const todayTotal = data?.stats?.todayAmount;

            return {
                sortedInvoices: sorted,
                todayInvoices: todays,
                todayRevenue: todayTotal,
                totalRevenue: total,
            };
        }

        return {
            sortedInvoices: [],
            todayInvoices: [],
            todayRevenue: 0,
            totalRevenue: 0,
        };
    }, [invoices]);

    // ✅ Memoize selected data based on activeCard
    const selectedData = useMemo(() => {
        if (activeCard === "today") {
            return todayInvoices;
        } else {
            return sortedInvoices;
        }
    }, [activeCard, todayInvoices, sortedInvoices]);

    // 🔹 Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const handleCardClick = (cardType) => {
        setActiveCard(cardType);
    };


    return (
        <div className="p-3 w-full grid gap-6">
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {isLoading ? (
    <>
      <RevenueCardSkeleton />
      <RevenueCardSkeleton />
    </>
  ) : (
    <>
     
        {/* Today Revenue */}
                <div
                    onClick={() => handleCardClick("today")}
                    className={`cursor-pointer rounded-xl shadow-md border border-pink-100 h-[106px] flex items-center gap-4 px-5 transition-all duration-300 ${activeCard === "today"
                            ? "bg-[#FF007B]"
                            : "bg-white hover:bg-pink-50"
                        }`}
                >
                    <div
                        className={`w-14 h-14 rounded-full flex justify-center items-center text-2xl shadow-md ${activeCard === "today"
                                ? "bg-white text-[#FF007B]"
                                : "bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white"
                            }`}
                    >
                        <GrDocumentText />
                    </div>
                    <div className="flex flex-col">
                        <span
                            className={`text-sm font-semibold ${activeCard === "today"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                        >
                            Today's Revenue
                        </span>
                        <span
                            className={`text-2xl font-semibold ${activeCard === "today"
                                    ? "text-white"
                                    : "text-gray-800"
                                }`}
                        >
                            ₹
                            {Number(todayRevenue).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>

                {/* Total Revenue */}
                <div
                    onClick={() => handleCardClick("total")}
                    className={`cursor-pointer rounded-xl shadow-md border border-pink-100 h-[106px] flex items-center gap-4 px-5 ${activeCard === "total"
                            ? "bg-[#FF007B]"
                            : "bg-white hover:bg-pink-50"
                        }`}
                >
                    <div
                        className={`w-14 h-14 rounded-full flex justify-center items-center text-2xl shadow-md ${activeCard === "total"
                                ? "bg-white text-[#FF007B]"
                                : "bg-gradient-to-b from-[#FF007B] to-[#280F22] text-white"
                            }`}
                    >
                        <GrDocumentText />
                    </div>
                    <div className="flex flex-col">
                        <span
                            className={`text-sm font-semibold ${activeCard === "total"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                        >
                            Total Revenue
                        </span>
                        <span
                            className={`text-2xl font-semibold ${activeCard === "total"
                                    ? "text-white"
                                    : "text-gray-800"
                                }`}
                        >
                            ₹
                            {Number(totalRevenue).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
                  </>
                 )}
        
            </div>
            

            {/* Table Section */}
<div className="bg-[#FFFFFF] border p-3 border-[#FDCDE4] rounded-lg w-full">
  <span className="text-xl font-medium mb-2 block">
    Recent Transactions ({activeCard === "today" ? "Today" : "All Time"})
  </span>

  {/* ================= DESKTOP TABLE (UNCHANGED) ================= */}
  <div className="hidden md:block overflow-x-auto w-full">
    <table className="w-full text-sm md:text-base border-collapse">
      <thead>
        <tr className="bg-[#FF007B1A] h-12 text-[#000000]">
          <th className="px-3 text-left">Customer</th>
          <th className="px-3 text-left">Date/Time</th>
          <th className="px-3 text-left">Amount</th>
          <th className="px-3 text-left">Payment</th>
          <th className="px-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))
        ) : selectedData?.length > 0 ? (
          selectedData.map((item, index) => {
            const created = new Date(item.createdAt);
            const date = created.toLocaleDateString("en-IN");
            const time = created.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-[#FFF5FA] transition"
              >
                <td className="py-2 px-3">{item.customer_name || "N/A"}</td>
                <td className="py-2 px-3">
                  {date} <br /> {time}
                </td>
                <td className="py-2 px-3">
                  ₹
                  {Number(item.total_amount || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-3 capitalize">
                  {item.payment_method || "N/A"}
                </td>
                <td className="py-2 px-3 text-[#028322] font-semibold">
                  Paid
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-5 text-gray-500 font-medium">
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* ================= MOBILE CARD VIEW ================= */}
  <div className="md:hidden space-y-4 mt-4">
    {isLoading ? (
      Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-xl border border-[#FDCDE4] shadow animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))
    ) : selectedData?.length > 0 ? (
      selectedData.map((item, index) => {
        const created = new Date(item.createdAt);
        const date = created.toLocaleDateString("en-IN");
        const time = created.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={index}
            className="bg-white border border-[#FDCDE4] rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-[#000] text-sm">
                {item.customer_name || "N/A"}
              </h4>
              <span className="text-[#028322] font-semibold text-sm">
                Paid
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-1">
              {date} · {time}
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold">
                ₹
                {Number(item.total_amount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="capitalize">
                {item.payment_method || "N/A"}
              </span>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-5 text-gray-500 font-medium">
        No transactions found
      </div>
    )}
  </div>

  {/* ================= PAGINATION (UNCHANGED) ================= */}
  {activeCard === "total" &&
    data?.pagination &&
    data.pagination.totalPages > 1 && (
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          className="px-3 py-1 border border-[#FF007B] rounded-md text-[#FF007B] disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Prev
        </button>

        {Array.from(
          { length: data.pagination.totalPages },
          (_, i) => i + 1
        ).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded-md border ${
              page === p
                ? "bg-[#FF007B] text-white border-[#FF007B]"
                : "border-gray-300 text-gray-700 hover:bg-pink-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          className="px-3 py-1 border border-[#FF007B] rounded-md text-[#FF007B] disabled:opacity-50"
          disabled={page === data.pagination.totalPages}
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, data.pagination.totalPages)
            )
          }
        >
          Next
        </button>
      </div>
    )}
</div>
        </div>
    );
};

export default Revenue;