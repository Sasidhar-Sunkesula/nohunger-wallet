import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { getBalance } from "@/app/lib/actions/getTransactions";
import { BalanceCard } from "@/components/BalanceCard";
import { OnRampTransactions } from "@/components/OnRampTransactions";
import prisma from "@repo/db/client";
export default async function () {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  const balance = await getBalance();
  const transactionsArr = await prisma.orders.findMany({
    where: {
      userId: Number(session.user.id),
    },
  });
  const transactions = transactionsArr.map((item) => ({
    time: item.date,
    amount: item.orderTotal,
    status: item.status,
    provider: "",
  }));
  return (
    <div className="flex flex-col gap-3 w-max mx-auto p-16">
      <div className="text-3xl font-bold mt-6">
        Welcome to your Dashboard{" "}
        <span className="text-blue-600">{session.user.name}</span>
      </div>
      <div className="text-xl font-normal">
        Add money into your wallet 👜 and avail exclusive offers and cashbacks
        💵
      </div>
      <div className="text-xl font-normal">Supports Multiple banks</div>
      <div className="text-xl font-normal">Secure transactions</div>
      <BalanceCard amount={balance.amount} locked={balance.locked} />
      <div className="pt-4">
        <OnRampTransactions
          title="Recent orders"
          transactions={transactions}
          plusMinus="-"
        />
      </div>
    </div>
  );
}
