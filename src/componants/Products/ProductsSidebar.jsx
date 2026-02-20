import React, { useState } from "react";
import { useGetAllproductQuery } from "../../redux/apis/adminApi";

const ProductsSidebar = () => {
    const { data, isLoading } = useGetAllproductQuery();
    const [activeCategory, setActiveCategory] = useState("");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Extract categories dynamically from API data
    const categories = data?.data?.map((item) => item.product_catagory) || [];

    return (
        <div className="w-full lg:w-[230px] bg-[#FF007B1A] rounded-2xl p-4 flex flex-wrap lg:flex-col gap-3 justify-center lg:justify-start">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-center px-4 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                            ? "bg-gradient-to-r from-[#280F22] to-[#8E3579] text-white"
                            : "text-[#8E3579] hover:bg-[#FFD7EA]"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default ProductsSidebar;
