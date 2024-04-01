"use client";
import React, { useContext, useEffect, useState } from "react";
import { UpdateCartContext } from "@/app/_context/UpdateCartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShoppingBasket } from "lucide-react";

const ConfirmOrder = (props) => {
  const { orderDetails, router } = props;
  const {
    data: { attributes },
  } = orderDetails;

  return (
    <article className="py-10 px-14 md:px-20 text-center">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
      <p className="py-3">
        Your order will be processed within 24 hours during working days. We
        will <br /> notify you by email once your order has been shipped
      </p>

      <article className="w-[300px] m-auto mt-5">
        <h2 className="font-bold pb-2">Billing Address</h2>
        <article className="flex items-center justify-between">
          <h3 className="font-bold">Name</h3>
          <h3>{attributes.username}</h3>
        </article>
        <article className="flex items-center justify-between">
          <h3 className="font-bold">Address</h3>
          <h3>{attributes.address}</h3>
        </article>
        <article className="flex items-center justify-between">
          <h3 className="font-bold">Phone</h3>
          <h3>{attributes.phone}</h3>
        </article>
        <article className="flex items-center justify-between">
          <h3 className="font-bold">Email</h3>
          <h3>{attributes.email}</h3>
        </article>

        <Button
          className="flex items-center gap-2 mt-10 w-full"
          onClick={() => router.push("/orders")}
        >
          Track Order
        </Button>
      </article>
    </article>
  );
};

function Checkout() {
  const { updateCart, setupdateCart } = useContext(UpdateCartContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const [cartItems, setCartItems] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    address: "",
  });
  const [isConfirmedOrder, setConfirmedOrder] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      router.push("/sign-in");
    }
  }, [updateCart]);

  const fetchCartItems = async () => {
    await api
      .get(
        `/user-carts?filters[userID][$eq]=${user.id}&populate[products][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data;
          const cartItems = data.map((item) => ({
            id: item.id,
            name: item.attributes.products.data[0].attributes.name,
            amount: item.attributes.amount,
            quantity: item.attributes.quantity,
            price: item.attributes.products.data[0].attributes.mrp,
            product: item.attributes.products.data[0].id,
            image:
              item.attributes.products.data[0].attributes.image.data.attributes
                .url,
          }));

          setCartItems(cartItems);
          setTotalCartItems(res.data.data.length);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let total = 0;
    cartItems.forEach((cartitem) => {
      total = total + cartitem.amount;
    });

    setSubTotal(total.toFixed(2));
  }, [cartItems]);

  const calculateTotalAmmount = () => {
    const totalAmount = subtotal * 0.9 + 15;
    return totalAmount.toFixed(2);
  };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    const data = {
      data: {
        paymentId: `2024${user.id}`,
        totalOrderAmount: calculateTotalAmmount(),
        userId: user.id,
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        zip: formData.zip,
        address: formData.address,
        orderItemList: cartItems,
      },
    };

    await api
      .post("/orders", data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          cartItems.forEach((item) => {
            handleDelete(item.id);
          });

          setConfirmedOrder(true);
          setLoading(false);
          setOrderDetails(res.data);
          fetchCartItems();
          setupdateCart(!updateCart);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    await api
      .delete(`user-carts/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fetchCartItems();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <article>
      <h1 className="bg-primary text-white font-bold p-3 text-center text-2xl">
        Checkout
      </h1>

      {isConfirmedOrder ? (
        <ConfirmOrder router={router} orderDetails={orderDetails} />
      ) : (
        <article className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 px-14 md:px-20">
          <article className="md:col-span-2 order-last md:order-1">
            <h1 className="font-bold text-3xl py-3">Billing Details</h1>
            <form className="grid grid-cols-2 gap-3 ">
              <Input
                className="outline-none"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInput}
              />
              <Input
                className="outline-none"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
              />
              <Input
                className="outline-none"
                placeholder="Phone"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleInput}
              />
              <Input
                className="outline-none"
                placeholder="Zip code"
                type="number"
                name="zip"
                value={formData.zip}
                onChange={handleInput}
              />
              <Input
                className="outline-none col-start-1 col-end-3"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleInput}
              />
              <Button
                className="flex items-center gap-3 w-fit"
                onClick={handleCreateOrder}
                disabled={
                  formData.name.trim() == "" ||
                  formData.address.trim() == "" ||
                  formData.zip.trim() == "" ||
                  formData.phone.trim() == "" ||
                  formData.email.trim() == "" ||
                  isLoading
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order
              </Button>
            </form>
          </article>

          <article className="border md:order-2">
            <h1 className="bg-slate-200 p-2 text-center font-bold">
              Total Cart <span>({totalCartItems})</span>
            </h1>

            <article className="p-4">
              <article className="flex items-center justify-between p-2 border-b-2">
                <h1 className="font-bold">Subtotal:</h1>
                <h1 className="font-bold">{subtotal} Rs</h1>
              </article>

              <article className="flex items-center justify-between p-2">
                <h1>Delivery :</h1>
                <h1>15.00 Rs</h1>
              </article>

              <article className="flex items-center justify-between p-2">
                <h1>Tax (9%)</h1>
                <h1>{(totalCartItems * 0.9).toFixed(2)} Rs</h1>
              </article>

              <article className="flex items-center justify-between p-2 border-t-2">
                <h1 className="font-bold">Total :</h1>
                <h1 className="font-bold">{calculateTotalAmmount()} Rs</h1>
              </article>
            </article>
          </article>
        </article>
      )}
    </article>
  );
}

export default Checkout;
