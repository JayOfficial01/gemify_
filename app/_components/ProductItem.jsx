import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader, Loader2, ShoppingBasket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { api } from "../_utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_context/UpdateCartContext";

const ProductItemsDetails = (props) => {
  const { attributes, id } = props;
  const {
    image,
    name,
    sellingPrice,
    mrp,
    description,
    itemQuantityType,
    categories,
  } = attributes;

  const isJwtTokenAvaialble = sessionStorage.getItem("jwt") ? true : false;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jwt = sessionStorage.getItem("jwt");
  const { updateCart, setupdateCart } = useContext(UpdateCartContext);
  const [productTotalPrice, setProductTotalPrice] = useState(sellingPrice);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCartItem = async () => {
    setLoading(true);

    if (!isJwtTokenAvaialble) {
      router.push("/sign-in");
      setLoading(false);
    } else {
      const data = {
        data: {
          quantity: quantity,
          amount: (quantity * productTotalPrice).toFixed(2),
          products: id,
          users_permissions_users: user.id,
          userID: user.id,
        },
      };

      await api
        .post("/user-carts", data, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);
            toast("Product Added to cart");
            setupdateCart(!updateCart);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast("Something went wrong");
        });
    }
  };

  return (
    <article className="flex max-[768px]:flex-col items-center md:items-start gap-10 bg-white text-black">
      <Image
        src={
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          image?.data?.attributes?.url
        }
        alt={`${name} image`}
        width={500}
        height={200}
        className=" object-contain group-hover:scale-105 transition-all ease-in-out h-[320px] w-[300px]"
      />

      <article className="flex-1 pt-5 max-[768px]:w-full">
        <h3 className="font-bold text-3xl text-green-800 ">{name}</h3>
        <p className="pt-1 mb-5 text-gray-500">
          {description[0]?.children[0]?.text}
        </p>
        <article className="flex items-center justify-between gap-5">
          <h3 className="font-bold text-2xl">{sellingPrice} Rs</h3>
          <h3 className="font-medium text-lg line-through text-gray-500">
            {mrp} Rs
          </h3>
        </article>

        <h2 className="font-medium text-lg max-[768px]:text-left ">
          Quantity ({itemQuantityType}){" "}
        </h2>

        <article className=" flex items-center max-[768px]:justify-between gap-3 mt-5">
          <article className="p-2 px-5 border flex gap-10 items-center w-fit">
            <button
              disabled={quantity == 1}
              onClick={() => setQuantity(quantity - 1)}
              className="text-lg"
            >
              -
            </button>
            <h2>{quantity}</h2>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-lg"
            >
              +
            </button>
          </article>
          <h2 className="text-2xl font-bold">
            = {(quantity * productTotalPrice).toFixed(2)} Rs
          </h2>
        </article>

        <Button
          className="flex gap-3 items-center mt-5 w-full md:w-fitt"
          onClick={handleAddToCartItem}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <ShoppingBasket />}
          Add To Cart
        </Button>

        <h2 className="mt-3">
          Catagory :{" "}
          <span className="font-medium">
            {categories?.data[0]?.attributes?.name}
          </span>
        </h2>
      </article>
    </article>
  );
};

function ProductItem(props) {
  const { attributes } = props;
  const { image, name, sellingPrice, mrp } = attributes;

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <figure className="bg-white border rounded-lg flex flex-col items-center justify-between p-3 cursor-pointer gap-2 group">
            <Image
              src={
                process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                image?.data?.attributes?.url
              }
              alt={`${name} image`}
              width={500}
              height={200}
              className=" object-contain group-hover:scale-105 transition-all ease-in-out h-[200px] w-[250px]"
            />

            <figcaption className="text-center">
              <h3 className="font-bold text-lg text-green-800">{name}</h3>
              <article className="flex items-center justify-between gap-5">
                <h3 className="font-bold text-lg">{sellingPrice} Rs</h3>
                <h3 className="font-medium text-lg line-through text-gray-500">
                  {mrp} Rs
                </h3>
              </article>
            </figcaption>
          </figure>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <ProductItemsDetails {...props} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductItem;
