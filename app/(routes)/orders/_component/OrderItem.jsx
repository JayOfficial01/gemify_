import Image from "next/image";
import React from "react";

function OrderItem(props) {
  return (
    <article className="py-3 flex items-center justify-between w-[50%] border-b-2">
      <Image
        src={
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          props.product.data.attributes.image.data.attributes.url
        }
        alt={props.product.data.attributes.name + "image"}
        width={200}
        height={200}
        className="w-[80px] h-[80px] content-fit border p-3 bg-slate-50 rounded-lg"
      />

      <article>
        <h2>{props.product.data.attributes.name} </h2>
        <h2>Item Price : {props.price} Rs </h2>
      </article>

      <h2>Quantity: {props.quantity}</h2>
      <h2>{props.price} Rs </h2>
    </article>
  );
}

export default OrderItem;
