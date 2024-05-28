import { LinkComponent } from "./Link";
import { Button } from "./button";

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


export const Appbar = ({ user, onSignin, onSignout, headerLinks }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b py-2 px-4 border-slate-300">
      <div className="text-xl font-bold text-red-900  flex items-center justify-center">No Hunger</div>
      <div className="flex items-center border gap-x-5 border-red-600 justify-center pt-2">
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
