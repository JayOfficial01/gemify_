"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/_utils/GlobalApi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from "moment";
import OrderItem from "./_component/OrderItem";

function page() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    await api
      .get(
        `/orders?filters[userId][$eq]=${user.id}&populate[orderItemList][populate][product][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        setOrders(
          res.data.data.map((item) => ({
            id: item.id,
            totalOrderAmount: item.attributes.totalOrderAmount,
            paymentId: item.attributes.paymentId,
            orderItemList: item.attributes.orderItemList,
            createdAt: item.attributes.createdAt,
          }))
        );
      })
      .catch((err) => console.log(err));
  };

  console.log("orders", orders);

  return (
    <article>
      <h1 className="p-3 text-center bg-primary text-white text-2xl font-bold">
        My Order
      </h1>

      <article className="py-10 px-14 md:px-20">
        <h1 className="text-primary text-4xl font-bold">Order History</h1>

        <Collapsible className="mt-5">
          {orders.map((order, index) => {
            const { createdAt, orderItemList, totalOrderAmount } = order;

            return (
              <>
                <CollapsibleTrigger className="bg-slate-100 p-2 flex items-center gap-5">
                  <h2 className="flex items-center gap-2">
                    <span className="font-bold">Order Date :</span>{" "}
                    {moment(createdAt).add(10, "days").calendar()}
                  </h2>

                  <h2 className="flex items-center gap-2">
                    <span className="font-bold">Total Amount:</span>{" "}
                    {totalOrderAmount} Rs
                  </h2>

                  <h2 className="flex items-center gap-2">
                    <span className="font-bold">Status :</span> Pending
                  </h2>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {orderItemList.map((item, index) => (
                    <OrderItem {...item} key={index} />
                  ))}
                </CollapsibleContent>
              </>
            );
          })}
        </Collapsible>
      </article>
    </article>
  );
}

export default page;
