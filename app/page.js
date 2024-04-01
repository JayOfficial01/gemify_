"use client";
import Image from "next/image";
import Catagories from "./_components/Catagories";
import Products from "./_components/Products";
import Slider from "./_components/Slider";
import useFetchData from "./_hooks/useFetchData";

export default function Home() {
  const data = useFetchData("/products?populate=*");

  return (
    <main>
      <Slider />
      <Catagories />
      <Products {...data} />
      <Image
        src="/banner.png"
        alt="Delivery Banner Image"
        width={1000}
        height={500}
        className="w-fit mb-14 m-auto rounded-lg px-10 lg:px-0"
      />
    </main>
  );
}
