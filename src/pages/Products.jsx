import React, { useState } from 'react'
import InStock from "../pages/InStock";
import OutOfStock from "../pages/OutOfStock";

const Products = () => {

    const [activeTab, setActiveTab] = useState("inStock")
    
    return (
        <>
            <div className="flex justify-start gap-3 mt-4">
                <button
                    onClick={() => setActiveTab("inStock")}
                    className={`px-6 py-2 rounded-lg font-medium text-white ${activeTab === "inStock" ? "bg-[#F90078]" : "bg-[#e70f77be]"}`}
                >
                    In Stock
                </button>
                <button
                    onClick={() => setActiveTab("outOfStock")}
                    className={`px-6 py-2 rounded-lg font-medium text-white ${activeTab === "outOfStock" ? "bg-[#F90078]" : "bg-[#e70f77be]"}`}
                >
                    Out of Stock
                </button>
            </div>
            
            <div className="mt-4">
                {activeTab === "inStock" ? <InStock /> : <OutOfStock />}
            </div>

        </>
    );
}

export default Products;