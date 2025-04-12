import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure for an item in the cart
export interface CartItem {
  id: number;
  name: string;
  price: number;
  ratings: number;
  imageId: string;
  quantity: number; // Added quantity field
}

export interface CartState {
  items: CartItem[]; // State holds an array of CartItem
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action to completely overwrite the cart (e.g., when loading from DB)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    // Action to add an item or increment its quantity
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const itemToAdd = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemToAdd.id
      );

      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        state.items[existingItemIndex]!.quantity += 1;
      } else {
        // Item doesn't exist, add it with quantity 1
        state.items.push({ ...itemToAdd, quantity: 1 });
      }
    },
    // Action to remove an item or decrement its quantity
    removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex]!;
        if (existingItem.quantity > 1) {
          // Decrement quantity
          existingItem.quantity -= 1;
        } else {
          // Remove item if quantity is 1
          state.items.splice(existingItemIndex, 1);
        }
      }
    },
    // Action to clear the entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addToCart, removeFromCart, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
