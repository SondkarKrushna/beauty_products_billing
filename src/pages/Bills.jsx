import React, { useMemo, useRef, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useGetInvoicebyIdQuery } from "../redux/apis/adminApi";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import img from "../assets/images/logo.jpg";
import { useLocation } from "react-router-dom";

const Bill = ({ invoiceId: propInvoiceId, onClose }) => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();
    const invoiceId = propInvoiceId || routeId;
    const location = useLocation();

    const invoiceFromState = location.state?.invoice;
    const invoice = invoiceFromState || result;
    const mapProducts = invoice?.product_details ?? [];

    const printRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: result, isLoading } = useGetInvoicebyIdQuery(invoiceId, {
        skip: !invoiceId,
    });

    const handleClose = () => {
        if (onClose) onClose();
        else navigate(-1);
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;

        setIsDownloading(true);

        await document.fonts.ready;
        await new Promise((r) => setTimeout(r, 300));

        const input = printRef.current;

        try {
            const canvas = await html2canvas(input, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice-${invoice?.bill_number || "Invoice"}.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = async () => {
        if (!printRef.current) return;

        setIsDownloading(true);

        await document.fonts.ready;
        await new Promise((r) => setTimeout(r, 300));

        const input = printRef.current;

        try {
            const canvas = await html2canvas(input, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");

            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              text-align: center;
            }
            img {
              width: 100%;
              max-width: 600px;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
        </body>
      </html>
    `);
            iframeDoc.close();

            iframe.onload = () => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            };
        } catch (error) {
            console.error("Print Error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const date = new Date(invoice.createdAt);

    const formattedDate = `${date.getDate().toString().padStart(2, "0")} / ${date.getFullYear().toString().slice(-2)
        } / ${date.toLocaleString("en-IN", { month: "long" })} - ${date.toLocaleString("en-IN", { weekday: "long" })
        }`;


    if (isLoading && !invoiceFromState) {

        return (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-[700px] text-center">
                    <p className="text-pink-600 font-semibold text-lg">
                        Loading Invoice...
                    </p>
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    const subTotal = useMemo(
        () =>
            mapProducts.reduce(
                (acc, item) =>
                    acc + item.unit_price * item.product_quantity,
                0
            ),
        [mapProducts]
    );

    const taxAmount = useMemo(
        () =>
            mapProducts.reduce(
                (acc, item) =>
                    acc +
                    (item.unit_price *
                        item.product_quantity *
                        item.tax) /
                    100,
                0
            ),
        [mapProducts]
    );

    const grandTotal = useMemo(
        () => mapProducts.reduce((acc, item) => acc + item.total_price, 0),
        [mapProducts]
    );

    return (
        <div className=" bg-gray-100 flex justify-center py-10">
            <div
                ref={printRef}
                className="bg-white w-[500px] rounded-lg shadow-xl font-sans flex flex-col"
            >

                {/* Header */}
                <div
                    className="h-28 text-white flex items-center justify-between px-8 bg-no-repeat bg-center"
                    style={{
                        backgroundImage: "url('/Group 4.png')",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="flex flex-col items-center text-center">
                        <img src={img} alt="logo" className="w-10 h-10" />
                        <div className="mb-6">
                            <h1
                                className="text-xl leading-none"
                                style={{ fontFamily: '"Great Vibes", cursive' }}
                            >
                                Sonal
                            </h1>
                            <p className="text-xs font-semibold">Cosmetics</p>
                        </div>
                    </div>
                    <p className="text-xl font-semibold tracking-wider">
                        INVOICE
                    </p>
                </div>

                {/* Body */}
                <div className="px-8 py-6 overflow-y-auto flex-grow">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Customer,</p>
                            <p className="text-[#FF007B] font-bold text-base">
                                {invoice.customer_name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <IoMdCall className="text-[#FF007B]" />
                                <p className="text-sm">{invoice.phone}</p>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <FaLocationDot className="text-[#FF007B]" />
                                <p className="text-sm">{invoice.address}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {!isDownloading && (
                                <div className="flex gap-2 justify-end mb-2">
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="bg-[#FF007B] text-white px-3 py-1 rounded-full text-xs hover:bg-[#d40066] transition-colors"
                                    >
                                        Download PDF
                                    </button>

                                    <button
                                        onClick={handlePrint}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Print
                                    </button>
                                </div>
                            )}

                            <p className="font-bold text-[#FF007B]">Sonal Cosmetics</p>
                            <p className="text-xs mt-3">
                                Invoice No - <span className="font-semibold">{invoice.bill_number}</span>
                            </p>
                            <p className="text-xs">
                                <p>Date - {formattedDate}</p>
                            </p>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="border rounded-md  mt-4">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-gradient-to-r from-[#FF007B] to-[#99004A] text-xs text-white">
                                <tr>
                                    <th className="py-3 text-xs px-2">Sr</th>
                                    <th className="py-3 text-xs px-2 text-left">Product</th>
                                    <th className="py-3 text-xs px-2">Qty</th>
                                    <th className="py-3 text-xs px-2">Price</th>
                                    <th className="py-3 text-xs px-2">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mapProducts.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-3 text-xs px-2">{index + 1}</td>
                                        <td className="py-3 text-xs px-2 text-left">{item.product_name}</td>
                                        <td className="py-3 text-xs px-2">{item.product_quantity}</td>
                                        <td className="py-3 text-xs px-2">₹{item.unit_price}</td>
                                        <td className="py-3 text-xs px-2">₹{item.total_price}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="grid grid-cols-2 mt-8 text-sm">
                        <div>
                            <p className="font-semibold text-[#FF007B]">Mode of Payment</p>
                            <p className="capitalize text-gray-700">{invoice.payment_method}</p>
                        </div>

                        <div className="text-right space-y-1">
                            <p className="text-gray-600">Sub Total : <span className="font-semibold text-black">₹{subTotal}</span></p>
                            <p className="text-gray-600">Tax : <span className="font-semibold text-black">₹{taxAmount.toFixed(2)}</span></p>
                            <p className="text-[#FF007B] font-bold text-lg pt-1 border-t border-gray-100">
                                Grand Total : ₹{grandTotal}
                            </p>
                        </div>

                    </div>

                    {/* Signature - FIXED HEIGHT AND POSITIONING */}
                    <div className="mt-12 flex flex-col items-end px-4">
                        <div className="flex flex-col items-center">
                            <p
                                className="text-4xl text-[#333] leading-none"
                                style={{
                                    fontFamily: "'Great Vibes', cursive",
                                    paddingBottom: "14px",
                                }}
                            >
                                Sonal
                            </p>
                            <div className="w-32 border-t-2 border-[#FF007B]" />
                            <p className="text-sm font-bold text-gray-800 mt-1 uppercase tracking-tight">
                                Sonal Cosmetics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-[#FF007B] to-[#CC0063] text-white text-xs text-center py-2">
                    Terms & Conditions: Payment due within 7 days. Returns accepted within 7 days if unopened. Seller not liable for misuse.
                </div>
            </div>
        </div>
    );
};

export default Bill;
