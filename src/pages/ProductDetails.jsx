import React from "react";
import { useLocation } from "react-router-dom";
import { useGetProductbyIdQuery } from "../redux/apis/adminApi"; 
import ImageCard from "../componants/Products/ImageCard";
import TextCard from "../componants/Products/TextCard";

const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-[12px] py-6 space-y-6 animate-pulse">
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="w-full h-[400px] bg-gray-300 rounded-lg"></div>
      </div>
       
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>

        <div className="h-6 bg-gray-300 rounded w-1/4 mt-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const location = useLocation();
  const { id } = location.state || {};
   
  const { data, isLoading, error } = useGetProductbyIdQuery(id);
  
  if (isLoading) return <ProductDetailsSkeleton />;
  if (error) return <p>Something went wrong.</p>;

  const product = data?.data;

  return (
    <div className="max-w-[1600px] mx-auto px-[12px] py-6 space-y-6">
      <ImageCard product={product} />
      <TextCard product={product} />
    </div>
  );
};

export default ProductDetails;
