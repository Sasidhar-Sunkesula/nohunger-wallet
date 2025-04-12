"use client";
import Link from "next/link";

interface Item {
  to: string;
  text: string;
}

export function LinkComponent({ item }: { item: Item }) {
  const { to, text } = item;
  return (
    <Link
      href={to}
      className="text-slate-700 hover:text-slate-900 font-medium text-center w-full md:w-auto py-2 md:py-0"
    >
      {text}
    </Link>
  );
}
