"use client";
import { clearCart } from "@repo/store/cartSlice";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Spinner from "@repo/ui/spinner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCartDb } from "../lib/actions/cart";

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  );
}
function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get order details from URL params
  const orderId = searchParams.get("orderId") || "";
  const orderTotal = searchParams.get("orderTotal") || "0";
  const updatedBalance = searchParams.get("updatedBalance") || "0";
  const userId = searchParams.get("userId") || "";

  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    // Clear the cart in Redux store and database
    if (userId) {
      dispatch(clearCart());
      clearCartDb(parseInt(userId));
    }

    // Calculate estimated delivery time (30-45 minutes from now)
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 40 * 60000); // 40 minutes later
    const formattedTime = deliveryTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setEstimatedDelivery(formattedTime);
  }, [userId, dispatch]);

  if (!orderId) {
    // Redirect to home if no order ID is provided
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for your order. Your food is being prepared.
          </p>
        </div>

        <Card title="Order Summary">
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="text-lg font-medium">Order ID:</div>
              <div className="text-gray-700">{orderId}</div>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div className="text-lg font-medium">Order Total:</div>
              <div className="text-xl font-bold">₹{orderTotal}</div>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div className="text-lg font-medium">Updated Balance:</div>
              <div className="text-green-600 font-bold">₹{updatedBalance}</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">Estimated Delivery:</div>
              <div className="text-gray-700">{estimatedDelivery}</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your order will be delivered in approximately 30-45 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex flex-col space-y-3">
          <Link href="/dashboard">
            <Button className="w-full">View Order History</Button>
          </Link>
          <Link href="/">
            <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
