"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

function Products(props) {
  const { data, loading, error } = props;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      setProducts(data.data);
    }
  }, [data]);

  return (
    <article className="py-10 px-14 md:px-20">
      <h2 className="text-green-600 font-bold text-2xl">
        Our Popular Products
      </h2>

      <article className="my-3 grid grid-cols md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products?.map((product, index) => {
          return index < 8 && <ProductItem key={index} {...product} />;
        })}
      </article>
    </article>
  );
}

export default Products;
