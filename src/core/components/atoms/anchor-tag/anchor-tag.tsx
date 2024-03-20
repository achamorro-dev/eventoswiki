import type { FC, PropsWithChildren } from "react";

export const AnchorTag: FC<PropsWithChildren<{ href: string, active: boolean }>> = ({
  href,
  active,
  children,
}) => {
  return (
    <a
      href={href}
      className={`inline-flex items-center px-3 py-1.5 leading-none w-auto rounded-full text-xs font-bold uppercase border hover:bg-gray-100 dark:text-white dark:hover:text-slate-900 whitespace-nowrap ${active && '!bg-primary !text-white border-primary'}`}
    >
      {children}
    </a>
  );
};
