"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "@/app/lib/actions/createOnRampTransaction";

const SUPPORTED_BANKS = ["HDFC Bank", "Axis Bank"];

export const AddMoney = () => {
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]);
  const [value, setValue] = useState(0);

  return (
    <Card title="Add Money">
      <div className="w-full max-w-sm mx-auto">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          value={value.toString() || ""}
          onChange={(val) => {
            setValue(Number(val));
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          value={provider}
          onSelect={(value) => setProvider(value)}
          options={SUPPORTED_BANKS}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              const result = await createOnRampTransaction(provider, value);
              // Redirect to our mock bank page instead of the real bank website
              if (result && result.token) {
                window.location.href = `/mock-bank?token=${result.token}&userId=${result.userId}&amount=${value}&provider=${encodeURIComponent(provider)}`;
              }
            }}
            disabled={!value || !provider}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
