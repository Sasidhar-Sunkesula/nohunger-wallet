"use client";
import { p2pTransfer } from "@/app/lib/actions/p2pTransfer";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [transaction, setTransaction] = useState({
    message: "",
    success: false,
  });
  const handleSend = async () => {
    const result = await p2pTransfer(number, Number(amount));
    setTransaction(result);
    setAmount("");
    setNumber("");
    setTimeout(() => {
      setTransaction({
        message: "",
        success: false,
      });
    }, 3000);
  };

  return (
    <div>
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Phone Number"
              value={number}
              maxLength={10}
              onChange={(value) => {
                if (!isNaN(Number(value))) {
                  setNumber(value);
                }
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              value={amount}
              onChange={(value) => {
                if (!isNaN(Number(value))) {
                  setAmount(value);
                }
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button
                onClick={handleSend}
                disabled={amount === "" || number === ""}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
      {transaction.success && transaction.message && (
        <div className="text-green-500 mt-2 font-medium text-lg flex justify-center">
          {transaction.message}
        </div>
      )}
      {!transaction.success && transaction.message && (
        <div className="text-red-500 mt-2 font-medium text-lg flex justify-center">
          {transaction.message}
        </div>
      )}
    </div>
  );
}
