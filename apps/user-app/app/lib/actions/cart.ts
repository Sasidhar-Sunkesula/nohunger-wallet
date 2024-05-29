"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getCartDetails(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  console.log("id",userId);
  
  const cartData = await prisma.findFirst({
    where:{
        id: 1
    }
  })
  return {
    cart: cartData,
  };
}
