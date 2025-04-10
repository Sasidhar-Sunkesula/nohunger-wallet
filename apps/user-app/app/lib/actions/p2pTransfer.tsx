"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Prisma } from "@prisma/client";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;

  if (!from) {
    return {
      message: "Error while sending",
      success: false,
    };
  }
  if (amount <= 0) {
    return {
      message: "Amount must be greater than 0",
      success: false,
    };
  }

  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
      success: false,
    };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

      const fromUser = await tx.user.findUnique({
        where: { id: Number(from) },
        include: {
          Balance: true,
        },
      });
      if (!fromUser) {
        throw new Error("User not found");
      }
      if (fromUser.number !== from) {
        throw new Error("Can't send to yourself");
      }

      if (fromUser.Balance[0].amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      });
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Error while sending",
      success: false,
    };
  }

  return {
    message: "Sent successfully!",
    success: true,
  };
}
