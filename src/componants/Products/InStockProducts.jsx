import React, { useState } from "react";
import { useGetAllproductQuery } from "../../redux/apis/adminApi";
import productPlaceholder from "../../assets/images/product.jpg";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
    const { data, isLoading } = useGetAllproductQuery();
    const [activeCategory, setActiveCategory] = useState("");
    const navigate = useNavigate();
     
    if (isLoading) {
        return (
            <div className="flex flex-col lg:flex-row gap-3 p-4">
                {/* Shimmer Categories */}
                <div className="w-full lg:w-[230px] rounded-2xl p-4 flex flex-wrap lg:flex-col gap-3 justify-center lg:justify-start">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-24 rounded-full bg-gray-300 animate-pulse"
                        ></div>
                    ))}
                </div>

                {/* Shimmer Products Grid */}
                <div className="w-full min-h-screen p-4 rounded-3xl overflow-y-auto scrollbar-none">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow-sm w-full aspect-square flex flex-col items-center justify-center p-2 animate-pulse"
                            >
                                <div className="w-[110px] h-[120px] bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Filter categories that have at least one product with quantity > 0
    const categories = data?.data
        ?.filter((item) => item.product_array.some((p) => p.product_Quantity > 0))
        .map((item) => item.product_catagory) || [];

    // Filter products based on activeCategory and product_Quantity > 0
    const filteredProducts = activeCategory
        ? data.data
            .find((item) => item.product_catagory === activeCategory)
            ?.product_array.filter((p) => p.product_Quantity > 0) || []
        : data.data.flatMap((item) =>
            item.product_array.filter((p) => p.product_Quantity > 0)
        );

    return (
        <div className="flex flex-col lg:flex-row gap-3 p-4">
            {/* Categories */}
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

            {/* Products Grid */}
            <div className="w-full min-h-screen bg-[#FFD7EA75] p-4 rounded-3xl overflow-y-auto scrollbar-none">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {[...filteredProducts].reverse().map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-sm w-full flex flex-col items-center p-4 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() =>
                                    navigate("/app/productsDetails", { state: { id: product._id } })
                                }
                            >
                                {/* Fixed image container */}
                                <div className="w-full h-40 flex justify-center items-center overflow-hidden">
                                    <img
                                        src={
                                            product.product_images.length
                                                ? product.product_images[0]
                                                : productPlaceholder
                                        }
                                        alt={product.product_name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* Product Name */}
                                <h3 className="text-sm font-semibold text-gray-800 text-center mt-3 w-full line-clamp-2">
                                    {product.product_name}
                                </h3>

                                {/* Price */}
                                <p className="text-base font-bold text-[#FF007B] mt-1">
                                    ₹{product.price_online}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl shadow-sm flex items-center justify-center p-4 w-full h-52">
                            <span className="text-gray-500 font-semibold text-center">
                                No products available
                            </span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductsPage;
