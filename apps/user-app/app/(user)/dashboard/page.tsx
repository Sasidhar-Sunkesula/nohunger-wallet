import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
export default async function () {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex flex-col gap-3 p-16">
      <div className="text-3xl font-bold mt-6">
        Welcome to the Dashboard {session.user.email}
      </div>
      <div className="text-xl font-normal">
        Add money into your wallet 👜 and avail exclusive offers and cashbacks
        💵
      </div>
      <div className="text-xl font-normal">Supports Multiple banks</div>
      <div className="text-xl font-normal">Secure transactions</div>
    </div>
  );
}
