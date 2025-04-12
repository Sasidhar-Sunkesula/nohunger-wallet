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
  const [balance, setBalance] = useState<number | null>(null);
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
    dispatchFun(removeFromCart({ id: item.id }));
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
    <div className="w-full sm:w-4/5 md:w-3/5 mt-4 shadow-xl rounded-lg p-3 sm:p-4 mx-auto relative">
      <div className="text-lg sm:text-xl w-full sm:w-4/5 text-center mt-3 sm:mt-5 mb-3 mx-auto font-bold">
        Cart - {itemList.length} items
      </div>
      {balance && (
        <div className="w-full sm:w-4/5 flex flex-col sm:flex-row justify-between mb-5 items-center gap-3 sm:gap-0 mx-auto">
          <Link
            className="bg-green-100 text-green-800 text-sm sm:text-base font-medium p-2 rounded dark:bg-green-900 dark:text-green-300 w-full sm:w-auto text-center"
            href={"/dashboard"}
          >
            {`Available wallet balance : ₹${balance}`}
          </Link>
          <button
            onClick={() => handleClearCart()}
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-auto"
          >
            Clear Cart
          </button>
        </div>
      )}
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
                  try {
                    const result = await makePayment();
                    if (result.status === "success") {
                      // Redirect to order confirmation page with order details
                      const params = new URLSearchParams({
                        orderId: result.orderId.toString(),
                        orderTotal: result.orderTotal.toString(),
                        updatedBalance: result.updatedBalance.toString(),
                        userId: result.userId.toString(),
                      });
                      router.push(`/order-confirmation?${params.toString()}`);
                    } else {
                      // Handle error
                      throw new Error(result.message);
                    }
                  } catch (error: any) {
                    console.error("Payment error:", error);
                    setIsProcessing(false);
                    if (error?.message?.includes("Insufficient")) {
                      router.push("/transfer");
                    }
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
