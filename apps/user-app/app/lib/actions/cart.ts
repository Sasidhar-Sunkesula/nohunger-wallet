"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Item } from "@/components/ItemList";

export async function getCartDetails(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  try {
    const cartData = await prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        CartItems: {
          include: {
            Items: true,
          },
        },
      },
    });
    return {
      cart: cartData,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}

export async function addToCartDb(userId: number, item: Item) {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });
    if (!cart?.id) {
      throw Error("Cart doesn't exist for this user");
    }
    let itemId;
    const isItem = await prisma.items.findUnique({
      where: {
        id: item.id,
      },
    });
    if (!isItem) {
      const itemData = await prisma.items.create({
        data: item,
      });
      itemId = itemData.id;
    } else {
      itemId = isItem.id;
    }
    const cartItem = await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        itemId,
      },
    });

    return {
      data: cartItem,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}

export async function clearCartDb(userId: number) {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });
    if (!cart?.id) {
      throw Error("Cart doesn't exist for this user");
    }
    const cartItems = await prisma.cartItems.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    return {
      data: cartItems,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}

export async function removeFromCartDb(userId: number, itemId: number) {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });
    if (!cart) {
      throw Error("Cart doesn't exist for this user");
    }
    const cartItemId = await prisma.cartItems.findFirst({
      where: {
        itemId,
      },
    });
    if (!cartItemId) {
      throw Error("Item doesn't exist");
    }
    const cartItem = await prisma.cartItems.delete({
      where: {
        id: cartItemId.id,
      },
    });
    return {
      data: cartItem,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}

export async function getCartTotal(userId: number) {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });
    if (!cart) {
      throw Error("Cart doesn't exist for this user");
    }
    const cartItems = await prisma.cartItems.findMany({
      where: {
        cartId: cart.id,
      },
      include: {
        Items: true,
      },
    });
    const total = cartItems.reduce((acc, item) => {
      return acc + item.Items.price;
    }, 0);
    return {
      cost: total / 100,
    };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
}
