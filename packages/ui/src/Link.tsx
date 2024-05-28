"use client";
import Link from "next/link";

interface Item {
  to: string;
  text: string;
}

export function LinkComponent({ item }: { item: Item }) {
  const { to, text } = item;
  return (
    <div className="text-lg font-bold">
      <Link href={to}>{text}</Link>
    </div>
  );
}
