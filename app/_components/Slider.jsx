"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useFetchData from "../_hooks/useFetchData";
import Image from "next/image";

function Slider() {
  const [sliders, setSliders] = useState([]);

  const { data, loading, error } = useFetchData("/sliders?populate=*");

  useEffect(() => {
    if (data) {
      setSliders(data.data);
    }
  }, [data]);

  return (
    <article className="py-10 px-14 md:px-20">
      <Carousel>
        <CarouselContent>
          {sliders?.map((slider, index) => {
            const { attributes } = slider;
            return (
              <CarouselItem key={index}>
                <Image
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                    attributes?.image?.data?.attributes.url
                  }
                  alt={attributes.name}
                  width={1000}
                  height={400}
                  className="w-full h-[200] md:h-[400px] object-cover rounded-2xl"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </article>
  );
}

export default Slider;
