"use client";

import { useState } from "react";
import ItemList, { Item } from "./ItemList"; // Import ItemList and its Item type
import { AllItems } from "./AllItemsClient"; // Import the header/toggle component

interface MenuItemsWrapperProps {
  menuList: any[]; // Keep 'any' for now, refine if possible based on actual data structure
}

export function MenuItemsWrapper({ menuList }: MenuItemsWrapperProps) {
  const [showMenu, setShowMenu] = useState(true); // State to control visibility

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Prepare item props conforming to the Item interface expected by ItemList
  // This might need adjustment based on the actual structure within menuList
  const items: Item[] = menuList.map((item: any) => ({
    id: parseInt(item.card.info.id),
    name: item.card.info.name,
    price: item.card.info.price,
    ratings: parseFloat(item.card.info.ratings?.aggregatedRating?.rating ?? 0), // Handle potential missing ratings
    imageId: item.card.info.imageId,
  }));

  return (
    <div>
      {/* Pass state and toggle function to the AllItems component */}
      <AllItems
        showMenu={showMenu}
        toggleMenu={toggleMenu}
        itemCount={items.length}
      />

      {/* Conditionally render the list of items */}
      {showMenu && (
        <div>
          {items.map((item) => (
            <ItemList
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              ratings={item.ratings}
              imageId={item.imageId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
