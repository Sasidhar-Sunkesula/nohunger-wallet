"use client";

import { useState } from "react";
export function AllItems() {
  const [showMenu, setShowMenu] = useState(true);
  const handleClick = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div
      className="flex justify-between items-center cursor-pointer my-4 bg-slate-100 shadow-sm font-bold text-lg p-4 rounded-lg w-4/5 mx-auto"
      onClick={() => handleClick()}
    >
      <div>All Items</div>

      <button>+</button>
    </div>
  );
}
