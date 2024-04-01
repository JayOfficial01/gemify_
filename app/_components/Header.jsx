"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CircleUserRound, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import useFetchData from "../_hooks/useFetchData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../_utils/GlobalApi";
import { UpdateCartContext } from "../_context/UpdateCartContext";
import CartItemList from "./CartItemList";
import { toast } from "sonner";

function Header() {
  const { data } = useFetchData("/categories?populate=*");
  const [isLogin, setLogin] = useState(true);
  const { updateCart } = useContext(UpdateCartContext);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const [catagories, setCatagories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [updateCart]);

  useEffect(() => {
    setLogin(sessionStorage.getItem("jwt") ? false : true);
  }, []);

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
    if (data) {
      setCatagories(data.data);
    }
  }, [data]);

  const onSignOut = () => {
    sessionStorage.clear();
    router.push("/sign-in");
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
          toast("Item Deleted");
          fetchCartItems();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let total = 0;
    cartItems.forEach((cartitem) => {
      total = total + cartitem.amount;
    });

    setSubTotal(total.toFixed(2));
  }, [cartItems]);

  return (
    <header className="p-5 shadow-sm flex items-center justify-between">
      <article className="flex items-center gap-8 ">
        <Link href="/" className="flex items-center gap-1 text-3xl font-medium">
          <Image src="/logo-icon.png" alt="Logo icon" width={50} height={50} />
          Gemify
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <h2 className="md:flex items-center gap-2 border rounded-full p-2 font-semibold px-10 bg-slate-200 hidden cursor-pointer">
              <LayoutGrid className="h-5 w-5" /> Category
            </h2>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {catagories?.map((catagory, index) => {
              const { attributes } = catagory;
              return (
                <Link
                  key={index}
                  href={`/products-category/${attributes.name}`}
                >
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                        attributes?.icon?.data?.attributes?.url
                      }
                      alt={`${attributes.name} icon`}
                      width={23}
                      height={23}
                    />
                    <h2 className="font-medium">{attributes.name}</h2>
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <article className="md:flex items-center gap-3 border rounded-full p-2 px-5 hidden">
          <Search />
          <input type="text" placeholder="Search..." className="outline-none" />
        </article>
      </article>
      <article className="flex items-center gap-5">
        <Sheet>
          <SheetTrigger>
            <h2 className="flex items-center gap-1">
              <ShoppingBag className="w-7" />{" "}
              <span className="bg-primary px-2 py-0.1 rounded-full">
                {totalCartItems}
              </span>
            </h2>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mt-5">
              <SheetTitle className="bg-primary text-white font-bold p-3">
                My Cart
              </SheetTitle>
              <SheetDescription>
                {cartItems.length == 0 ? (
                  <p className="py-3 font-bold">No items in the cart</p>
                ) : (
                  <CartItemList
                    cartItemsList={cartItems}
                    handleDelete={handleDelete}
                  />
                )}
              </SheetDescription>
            </SheetHeader>

            <SheetClose disabled={cartItems.length == 0}>
              <article className="absolute w-[90%] bottom-6 flex flex-col">
                <h2 className="text-lg font-bold flex justify-between items-center">
                  SubTotal <span>{subtotal}Rs</span>
                </h2>
                <Button
                  onClick={() => router.push(isLogin ? "sign-in" : "/checkout")}
                  disabled={cartItems.length == 0}
                >
                  View Cart
                </Button>
              </article>
            </SheetClose>
          </SheetContent>
        </Sheet>

        {isLogin ? (
          <Button onClick={() => router.push("/sign-in")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleUserRound className="h-12 w-12 bg-green-100 text-primary p-2 rounded-full cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/orders")}
              >
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </article>
    </header>
  );
}

export default Header;
