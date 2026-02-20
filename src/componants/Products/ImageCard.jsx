import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

const ImageCard = ({ product }) => {
  if (!product) return null;

  const images = product.product_images || [];
  const [activeImage, setActiveImage] = useState(images[0] || "");

  // Update active image when product changes
  useEffect(() => {
    setActiveImage(images[0] || "");
  }, [product]);

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4">
      <h1 className="text-lg sm:text-xl font-semibold mb-3">
        Product Details
      </h1>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">

        {/* Main Image */}
        <div className="flex-shrink-0 w-full lg:w-80">
          <div className="w-full aspect-[4/3] lg:aspect-square">
            <img
              src={activeImage}
              alt={product.product_name}
              className="w-full h-full object-cover rounded-md border"
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div
          className="
    flex flex-row gap-3 w-full overflow-x-auto
    my-4 lg:my-0
    lg:grid lg:grid-cols-2 lg:gap-3 lg:w-auto lg:overflow-visible
  "
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-16 rounded-md object-cover cursor-pointer border
      ${activeImage === img
                  ? "border-pink-500"
                  : "border-gray-300"
                }`}
            />
          ))}
        </div>

        {/* Product Info */}
        <div className="w-full lg:flex-1 rounded-lg p-4 sm:p-5 shadow-md flex flex-col justify-between max-w-full lg:max-w-[500px]">

          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-black mb-2">
              {product.product_name}
            </h2>

            <p className="text-lg sm:text-2xl font-bold mb-2 text-[#FF007B]">
              Online ₹{product.price_online}
            </p>

            <p className="text-lg sm:text-2xl font-bold mb-2 text-[#FF007B]">
              Offline ₹{product.price_offline}
            </p>

            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Category - {product.category_name || "Uncategorized"}
            </p>

            {product.is_flash_sale && (
              <button className="text-xs sm:text-sm px-4 py-2 rounded-md mb-4 bg-[#FF007B33] text-[#FF007B]">
                Flash Sale Product
              </button>
            )}
          </div>

          <div className="flex items-center text-green-700 font-medium mt-3">
            <IoIosCheckmarkCircle className="text-lg sm:text-xl" />
            <span className="ml-2 text-sm sm:text-base">
              {product.product_availability
                ? "In Stock"
                : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;