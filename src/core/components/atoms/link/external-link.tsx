import type { FC, PropsWithChildren } from "react";

export const ExternalLink: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <a
      className="text-blue-800 dark:text-blue-200 underline"
      href={href}
      rel="nofollow"
      target="_blank"
    >
      {children}
    </a>
  );
};
