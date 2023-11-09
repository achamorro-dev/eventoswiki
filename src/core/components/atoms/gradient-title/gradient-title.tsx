import type { FC, PropsWithChildren } from "react";

export const GradientTitle: FC<PropsWithChildren> = ({children}) => {
  return (
    <h2 className="!text-3xl !font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-accent to-primary lg:!text-4xl xl:!text-5xl sm:mb-3">
      {children}
    </h2>
  )
}