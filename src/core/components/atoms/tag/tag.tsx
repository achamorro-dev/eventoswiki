import type { FC, PropsWithChildren } from "react";

export const Tag: FC<PropsWithChildren<{ color?: string }>> = ({
  color,
  children,
}) => {
  return (
    <span
      className={`flex items-center px-3 py-1.5 leading-none w-auto rounded-full text-xs font-medium uppercase text-white ${
        !color && "bg-accent"
      }`}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </span>
  );
};
