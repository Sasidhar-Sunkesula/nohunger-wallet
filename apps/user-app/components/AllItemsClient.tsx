"use client";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface AllItemsProps {
  showMenu: boolean;
  toggleMenu: () => void;
  itemCount: number;
}

export function AllItems({ showMenu, toggleMenu, itemCount }: AllItemsProps) {
  return (
    <div
      className="flex justify-between items-center cursor-pointer my-4 bg-slate-100 dark:bg-slate-700 shadow-sm font-bold text-lg p-4 rounded-lg w-full md:w-4/5 mx-auto"
      onClick={toggleMenu}
    >
      <div>Menu Items ({itemCount})</div>

      <button aria-label={showMenu ? "Collapse menu" : "Expand menu"}>
        {showMenu ? <FaChevronUp /> : <FaChevronDown />}
      </button>
    </div>
  );
}
