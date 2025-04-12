"use client";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./ItemList";
import { addToCart, removeFromCart, CartItem } from "@repo/store/cartSlice";
import { addToCartDb, removeFromCartDb } from "@/app/lib/actions/cart";
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';
import { RootState } from "@repo/store/appStore";
import { FaPlus, FaMinus } from "react-icons/fa";

export type AddToCartClientProps = Omit<Item, 'quantity'>;

export function AddToCartClient({ id, name, price, ratings, imageId }: AddToCartClientProps) {
  const session = useSession();
  const userId = session.data?.user?.id;
  const dispatch = useDispatch();

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === id)
  );

  const itemPayload = { id, name, price, ratings, imageId };

  const handleAddItem = async () => {
    if (!userId) {
      toast.error("Please log in to add items to the cart.");
      return;
    }
    dispatch(addToCart(itemPayload));
    toast.success(`${name} added to cart!`);
    try {
      const result = await addToCartDb(parseInt(userId), itemPayload);
      if (result.error) {
        console.error("DB Error adding item:", result.error);
        toast.error(`Failed to save ${name} to cart.`);
      }
    } catch (error) {
      console.error("Failed to update cart in DB:", error);
      toast.error(`Failed to add ${name} to cart database.`);
    }
  };

  const handleRemoveItem = async () => {
    if (!userId) {
      toast.error("Please log in to modify the cart.");
      return;
    }
    dispatch(removeFromCart({ id }));
    toast.error(`${name} removed from cart!`);
    try {
      const result = await removeFromCartDb(parseInt(userId), id);
      if (result.error) {
        console.error("DB Error removing item:", result.error);
        toast.error(`Failed to update ${name} in cart.`);
      }
    } catch (error) {
      console.error("Failed to update cart in DB:", error);
      toast.error(`Failed to remove ${name} from cart database.`);
    }
  };

  return (
    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-24">
      {cartItem && cartItem.quantity > 0 ? (
        <div className="flex items-center justify-between bg-white text-green-600 border border-gray-300 rounded-lg shadow-md w-full">
          <button
            onClick={handleRemoveItem}
            className="px-2 py-1 text-lg hover:bg-red-100 rounded-l-lg focus:outline-none"
            aria-label="Decrease quantity"
          >
            <FaMinus size={12} />
          </button>
          <span className="px-2 py-1 font-bold text-sm">
            {cartItem.quantity}
          </span>
          <button
            onClick={handleAddItem}
            className="px-2 py-1 text-lg hover:bg-green-100 rounded-r-lg focus:outline-none"
            aria-label="Increase quantity"
          >
            <FaPlus size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddItem}
          className="px-4 py-1 bg-white text-green-600 font-bold text-sm border border-gray-300 rounded-lg shadow-md hover:bg-green-500 hover:text-white focus:outline-none transition-colors duration-200"
        >
          ADD
        </button>
      )}
    </div>
  );
}
