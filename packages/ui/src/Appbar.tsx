import { LinkComponent } from "./Link";
import { Button } from "./button";
import Link from "next/link";
import { useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 bg-white dark:bg-gray-800 w-full z-10 h-auto min-h-16 flex flex-col md:flex-row md:h-16 justify-between border-b py-2 px-4 border-slate-300 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <Link
          href={"/"}
          className="text-xl font-bold text-red-900 dark:text-red-400 flex items-center justify-center"
        >
          No Hunger
        </Link>
        <button 
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-y-3 md:gap-y-0 gap-x-5 justify-center py-3 md:py-0 md:pt-2 transition-all duration-300 ease-in-out`}>
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
