"use client";
import React, { useEffect, useState } from "react";
import useFetchData from "../_hooks/useFetchData";
import Image from "next/image";
import Link from "next/link";

function Catagories() {
  const [catagories, setCatagories] = useState([]);

  const { data, loading, error } = useFetchData("/categories?populate=*");

  useEffect(() => {
    if (data) {
      setCatagories(data.data);
    }
  }, [data]);

  return (
    <article className="px-14 md:px-20">
      <h2 className="text-green-600 font-bold text-2xl">Shop by Catagory</h2>

      <article className="mt-3 grid grid-cols-3 sm:grid-cols-4 md-grid-cols-6 lg:grid-cols-7 gap-5">
        {catagories?.map((catagory, index) => {
          const { attributes } = catagory;

          return (
            <Link
              href={`/products-category/${attributes.name}`}
              key={index}
              className="flex flex-col items-center gap-2 bg-green-50 rounded-lg p-3 group cursor-pointer hover:bg-green-200"
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
    </article>
  );
}

export default Catagories;
