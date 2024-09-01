"use client";
import { useDispatch } from "react-redux";
import { Item } from "./ItemList";
import { addToCart } from "@repo/store/cartSlice";
import { addToCartDb } from "@/app/lib/actions/cart";
import { useSession } from "next-auth/react";

export function AddToCartClient({ id, name, price, ratings, imageId }: Item) {
  const session = useSession();
  const userId = session.data?.user.id;
  const dispatchFun = useDispatch();
  const handleAddItem = async (item: Item) => {
    dispatchFun(addToCart(item));
    await addToCartDb(parseInt(userId!), item);
  };
  return (
    <button
      onClick={() => handleAddItem({ id, name, price, ratings, imageId })}
      className="absolute px-2 py-1 hover:text-white hover:bg-green-500 font-medium rounded-lg bottom-1 left-1/4 bg-white text-green-600"
    >
      ADD +
    </button>
  );
}
