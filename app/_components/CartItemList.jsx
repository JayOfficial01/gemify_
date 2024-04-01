import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

function CartItemList({ cartItemsList, handleDelete }) {
  return (
    <article>
      <article className="h-[70vh] overflow-auto ">
        {cartItemsList.map((cartItem, index) => {
          return (
            <article
              key={index}
              className="flex justify-between items-center mb-3"
            >
              <figure className="flex items-center gap-6">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + cartItem?.image
                  }
                  alt={`${cartItem.name} image`}
                  width={300}
                  height={300}
                  className="border object-contain p-2 w-[70px] h-[70px]"
                />

                <figcaption>
                  <h2 className="font-bold">{cartItem.name}</h2>
                  <h2>Quantity {cartItem.quantity}</h2>
                  <h2 className="text-lg font-bold">{cartItem.amount} Rs</h2>
                </figcaption>
              </figure>

              <article
                className="cursor-pointer"
                onClick={() => handleDelete(cartItem.id)}
              >
                <TrashIcon />
              </article>
            </article>
          );
        })}
      </article>
    </article>
  );
}

export default CartItemList;
