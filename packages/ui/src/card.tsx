export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-3 sm:p-4 md:p-6 rounded-xl bg-[#ededed] dark:bg-gray-700 w-full max-w-full overflow-hidden shadow-sm">
      <h1 className="text-lg sm:text-xl border-b border-slate-300 dark:border-slate-600 pb-2 break-words font-semibold">
        {title}
      </h1>
      <div className="w-full pt-2">{children}</div>
    </div>
  );
}
