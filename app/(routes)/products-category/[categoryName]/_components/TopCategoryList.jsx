"use client";
import React, { useEffect, useState } from "react";
import useFetchData from "@/app/_hooks/useFetchData";
import Image from "next/image";
import Link from "next/link";

function TopCategoryList({ categoryName }) {
  const [catagories, setCatagories] = useState([]);
  const { data, loading, error } = useFetchData("/categories?populate=*");

  useEffect(() => {
    if (data) {
      setCatagories(data.data);
    }
  }, [data]);

  return (
    <article className="mt-3 flex items-stretch flex-wrap justify-center gap-3 px-7 md:px-20">
      {catagories?.map((catagory, index) => {
        const { attributes } = catagory;

        return (
          <Link
            href={`/products-category/${attributes.name}`}
            key={index}
            className={`flex flex-col items-center gap-2 bg-green-50 rounded-lg p-3 group cursor-pointer hover:bg-green-200 w-[150px] min-w-[100px] ${
              categoryName == attributes.name && "bg-green-200"
            }`}
          >
            <Image
              src={
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                attributes?.icon?.data?.attributes?.url
              }
              alt={`${attributes.name} icon`}
              width={50}
              height={50}
              className="group-hover:scale-125 transition-all ease-in-out"
            />

            <h2 className="text-green-800">{attributes?.name}</h2>
          </Link>
        );
      })}
    </article>
  );
}

export default TopCategoryList;
