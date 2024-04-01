"use client";
import React from "react";
import useFetchData from "@/app/_hooks/useFetchData";
import TopCategoryList from "./_components/TopCategoryList";
import Products from "@/app/_components/Products";

function ProductsCatagory({ params }) {
  const data = useFetchData(
    `/products?filters[categories][name][$in]=${params.categoryName}&populate=*`
  );

  return (
    <div>
      <h2 className="p-4 bg-primary text-white font-bold text-3xl text-center">
        {params.categoryName}
      </h2>
      <TopCategoryList categoryName={params.categoryName} />

      <Products {...data} />
    </div>
  );
}

export default ProductsCatagory;
