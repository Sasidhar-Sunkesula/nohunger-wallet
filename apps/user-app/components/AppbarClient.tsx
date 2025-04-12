"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";
import { RootState } from "@repo/store/appStore";
import { useSelector } from "react-redux";
interface LinkProps {
  to: string;
  text: string;
}

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  // Calculate total quantity of items in the cart
  const totalCartQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const headerLinks: LinkProps[] = [
    {
      to: "/dashboard",
      text: "Wallet",
    },
    {
      to: "/cart",
      // Update text to show total quantity
      text: `Cart-${totalCartQuantity} item${totalCartQuantity !== 1 ? 's' : ''}`,
    },
  ];
  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session.data?.user}
        headerLinks={headerLinks}
      />
    </div>
  );
}
