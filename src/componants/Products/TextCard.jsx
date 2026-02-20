import React from "react";

const TextCard = ({ product }) => {
  if (!product) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
      <div className="card h-full lg:h-[300px] w-full border border-pink-200 rounded-xl p-5">
        <div className="card-body h-full">
          <h2 className="card-title mb-5">Product Detail</h2>
          <p className="text-sm text-gray-700">{product.product_Deatils}</p>
        </div>
      </div>

      <div className="card h-full lg:h-[300px] w-full border border-pink-200 rounded-xl p-5">
        <div className="card-body h-full">
          <h2 className="card-title mb-2">Product Highlights</h2>
          <p className="text-sm text-gray-700">{product.product_Highlight}</p>
        </div>
      </div>

      <div className="card h-full lg:h-[300px] w-full border border-pink-200 rounded-xl p-5">
        <div className="card-body h-full">
          <h2 className="card-title mb-2">Description</h2>
          <p className="text-sm text-gray-700">{product.product_description}</p>
        </div>
      </div>

      <div className="card h-full lg:h-[300px] w-full border border-pink-200 rounded-xl p-5">
        <div className="card-body h-full">
          <h2 className="card-title mb-2">Quantity</h2>
          <p className="text-sm text-gray-700">
            Available Quantity: {product.product_Quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
