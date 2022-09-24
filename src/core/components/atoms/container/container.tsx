import type { FC, PropsWithChildren } from "react";
type ContainerProps = {
  maxSize?: "s" | "m" | "l";
};

const CONTAINER_MAX_SIZES: { [key: string]: string } = {
  s: "max-w-3xl",
  m: "max-w-5xl",
  l: "max-w-7xl",
};

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  maxSize = "l",
  children,
}) => {
  return (
    <div className="w-full px-6 pb-12 antialiased bg-white dark:bg-slate-800">
      <div className={`mx-auto ${CONTAINER_MAX_SIZES[maxSize]}`}>
        {children}
      </div>
    </div>
  );
};
