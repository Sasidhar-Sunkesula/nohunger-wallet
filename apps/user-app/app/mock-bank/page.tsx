"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Spinner from "@repo/ui/spinner";
import { TextInput } from "@repo/ui/textinput";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function MockBankPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Page />
    </Suspense>
  );
}
function Page() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get transaction details from URL params
  const token = searchParams.get("token") || "";
  const userId = searchParams.get("userId") || "";
  const amount = searchParams.get("amount") || "0";
  const provider = searchParams.get("provider") || "HDFC Bank";

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const isFormValid = () => {
    return (
      cardNumber.length === 16 &&
      cardName.trim().length > 0 &&
      expiryDate.length === 5 &&
      cvv.length === 3
    );
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      setError("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Call our webhook endpoint directly
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/hdfcWebhook`,
        {
          token,
          user_identifier: userId,
          amount,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        // Redirect back to the app after successful payment
        window.location.href = "/transactions";
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 16) return;
    setCardNumber(v);
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 4) return;

    if (v.length > 2) {
      setExpiryDate(`${v.substring(0, 2)}/${v.substring(2)}`);
    } else {
      setExpiryDate(v);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {provider} Payment
          </h2>
          <p className="mt-2 text-gray-600">Secure payment gateway</p>
        </div>

        <Card title="Payment Details">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-xl mb-4">
                Payment Successful!
              </div>
              <div className="text-gray-600">Amount: ₹{amount}</div>
              <div className="text-gray-600 mt-4">
                Redirecting to your account...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">Amount:</div>
                <div className="text-xl font-bold">₹{amount}</div>
              </div>

              <TextInput
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={formatCardNumber}
                maxLength={16}
              />

              <TextInput
                label="Cardholder Name"
                placeholder="John Doe"
                value={cardName}
                onChange={setCardName}
              />

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <TextInput
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={formatExpiryDate}
                    maxLength={5}
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    label="CVV"
                    placeholder="123"
                    value={cvv}
                    onChange={(v) =>
                      setCvv(v.replace(/[^0-9]/g, "").substring(0, 3))
                    }
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="pt-4">
                <Button
                  onClick={handlePayment}
                  disabled={loading || !isFormValid()}
                  className="w-full"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center mt-4">
                <p>This is a mock payment page for demonstration purposes.</p>
                <p>No actual payment will be processed.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
