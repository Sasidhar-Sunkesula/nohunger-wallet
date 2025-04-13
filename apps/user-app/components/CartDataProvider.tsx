"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getCartDetails } from "../app/lib/actions/cart";
import { setCart } from "@repo/store/cartSlice";

/**
 * CartDataProvider component that fetches cart data on initial load
 * regardless of which route the user is on
 */
export function CartDataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const session = useSession();

  const fetchCart = async (userId: number) => {
    const data = await getCartDetails(userId);
    if (!data.cart) {
      return;
    }
    const cartData = data.cart[0].CartItems.map((item) => item.Items);
    dispatch(setCart(cartData));
  };

  useEffect(() => {
    if (session.data?.user) {
      const userId = session.data?.user.id;
      fetchCart(parseInt(userId));
    }
  }, [session.data?.user]);

  return <>{children}</>;
}