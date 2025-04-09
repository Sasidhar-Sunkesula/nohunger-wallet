"use client";
import ItemList, { Item } from "@/components/ItemList";
import { RootState } from "@repo/store/appStore";
import { clearCart, removeFromCart, setCart } from "@repo/store/cartSlice";
import Spinner from "@repo/ui/spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCartDb,
  getCartDetails,
  getCartTotal,
  removeFromCartDb,
} from "../lib/actions/cart";
import { getBalance } from "../lib/actions/getTransactions";
import { makePayment } from "../lib/actions/makePayment";

export default function Cart() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fetchingPrice, setFetchingPrice] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemList = useSelector((store: RootState) => store.cart.items);
  const [balance, setBalance] = useState(-1);
  const dispatchFun = useDispatch();
  const session = useSession();
  const [cost, setCost] = useState(-1);
  const fetchCart = async (userId: number) => {
    const data = await getCartDetails(userId);
    if (!data.cart) {
      return;
    }
    const cartData = data.cart[0].CartItems.map((item: any) => item.Items);
    dispatchFun(setCart(cartData));
    setLoading(false);
  };

  const fetchBalance = async () => {
    const data = await getBalance();
    if (!data.amount) {
      return;
    }
    setBalance(data.amount);
  };
  const handleClearCart = async () => {
    dispatchFun(clearCart());
    await clearCartDb(parseInt(session.data?.user.id!));
  };
  const handleDelete = async (index: number, item: Item) => {
    const userId = session.data?.user.id;
    dispatchFun(removeFromCart(index));
    await removeFromCartDb(parseInt(userId!), item.id);
  };
  // If session.data?.user is not available at the time of component mounting, the fetchCart function will not be called, even if session.data?.user becomes available later.
  useEffect(() => {
    if (session.data?.user) {
      const userId = session.data?.user.id;
      fetchCart(parseInt(userId));
      fetchBalance();
    }
    // So, include session.data?.user in the dependency array of useEffect
  }, [session.data?.user]);

  useEffect(() => {
    const fetchTotal = async (userId: number) => {
      const total = await getCartTotal(userId);
      if (!total.cost) {
        console.log(total.error);
      } else {
        setCost(total.cost);
      }
      setFetchingPrice(false);
    };
    if (!session.data?.user.id) {
      return;
    }
    fetchTotal(parseInt(session.data.user.id));
  }, [itemList, session.data?.user]);

  return (
    <div className="w-3/5 mt-4 shadow-xl rounded-lg p-4 mx-auto relative">
      <div className="text-xl w-4/5 text-center mt-5 mb-3 mx-auto font-bold">
        Cart - {itemList.length} items
      </div>
      <div className="w-4/5 flex justify-between mb-5 items-center mx-auto">
        <Link
          className="bg-green-100 text-green-800 text-base font-medium me-2 p-2 rounded dark:bg-green-900 dark:text-green-300"
          href={"/dashboard"}
        >
          {balance !== -1 && `Available wallet balance : ₹${balance}`}
        </Link>
        <button
          onClick={() => handleClearCart()}
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Clear Cart
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="px-5">
          {itemList.map((item: Item, index: number) => (
            <div className="flex justify-center items-center" key={item.id}>
              <ItemList
                id={item.id}
                name={item.name}
                price={item.price}
                ratings={item.ratings}
                imageId={item.imageId}
              />
              <button
                onClick={() => handleDelete(index, item)}
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Delete
              </button>
            </div>
          ))}
          {itemList.length > 0 && (
            <div className="text-center">
              <button
                onClick={async () => {
                  setIsProcessing(true);
                  const response = await makePayment();
                  fetchBalance();
                  setIsProcessing(false);
                  if (response?.status === "error") {
                    router.push("/transfer");
                  }
                }}
                type="button"
                disabled={isProcessing}
                className={`text-white ${isProcessing && "cursor-not-allowed"} text-lg text-center mt-5 w-56 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ${fetchingPrice ? "..." : cost} with wallet`}
              </button>
            </div>
          )} 
        </div>
      )}
    </div>
  );
}
