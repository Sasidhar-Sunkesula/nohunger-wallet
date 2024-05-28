"use client";
import { useDispatch } from "react-redux";
import { Item } from "./ItemList";
import { addToCart } from "@repo/store/cartSlice";

export function AddToCartClient({ itemObj }: { itemObj: Item }) {
  const dispatchFun = useDispatch();
  const handleAddItem = (item: Item) => {
    dispatchFun(addToCart(item));
  };
  return (
    <button
      onClick={() => handleAddItem(itemObj)}
      className="absolute px-2 py-1 hover:text-white hover:bg-green-500 font-medium rounded-lg bottom-1 left-1/4 bg-white text-green-600"
    >
      ADD +
    </button>
  );
}
