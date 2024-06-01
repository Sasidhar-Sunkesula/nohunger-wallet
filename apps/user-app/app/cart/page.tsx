"use client";
import ItemList, { Item } from "@/components/ItemList";
import { RootState } from "@repo/store/appStore";
import { clearCart, removeFromCart, setCart } from "@repo/store/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCartDb,
  getCartDetails,
  getCartTotal,
  removeFromCartDb,
} from "../lib/actions/cart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Spinner from "@repo/ui/spinner";
import { makePayment } from "../lib/actions/makePayment";

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [fetchingPrice, setFetchingPrice] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemList = useSelector((store: RootState) => store.cart.items);
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
    }
    // So, include session.data?.user in the dependency array of useEffect
  }, [session.data?.user]);

  useEffect(() => {
    const fetchTotal = async (userId: number) => {
      setFetchingPrice(true);
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
      <div className="w-4/5 text-right mx-auto">
        <button
          onClick={() => handleClearCart()}
          className=" bg-red-500 p-2  font-medium text-sm rounded-lg text-white"
        >
          Clear Cart
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {itemList.map((item: Item, index: number) => (
            <div className="flex justify-center items-center" key={item.id}>
              <ItemList
                id={item.id}
                name={item.name}
                price={item.price}
                ratings={item.ratings}
                imageId={item.imageId}
              />
              <button onClick={() => handleDelete(index, item)}>
                <img src="deleteIcon.svg" alt="delete" />
              </button>
            </div>
          ))}
          {itemList.length > 0 && (
            <div className="text-center">
              <button
                onClick={async () => {
                  setIsProcessing(true);
                  const response = await makePayment();
                  console.log(response);
                  setIsProcessing(false);
                }}
                type="button"
                disabled={isProcessing}
                className="text-white  text-lg text-center mt-5 w-56 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
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
