import { LinkComponent } from "./Link";
import { Button } from "./button";
import Link from "next/link";
interface LinkProps {
  to: string;
  text: string;
}
interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: any;
  onSignout: any;
  headerLinks: LinkProps[];
}

export const Appbar = ({
  user,
  onSignin,
  onSignout,
  headerLinks,
}: AppbarProps) => {
  return (
    <div className="fixed top-0 bg-white w-full z-10 h-16 flex justify-between border-b py-2 px-4 border-slate-300">
      <Link
        href={"/"}
        className="text-xl font-bold text-red-900  flex items-center justify-center"
      >
        No Hunger
      </Link>
      <div className="flex items-center gap-x-5 justify-center pt-2">
        {headerLinks.map((item: LinkProps, index: number) => (
          <LinkComponent key={index} item={item} />
      ))}
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
