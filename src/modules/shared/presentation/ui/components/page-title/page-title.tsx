import type { PropsWithChildren } from 'react'

export const PageTitle = ({ children }: PropsWithChildren) => {
  return (
    <h1 className="mb-6 font-semibold text-3xl text-foreground leading-none tracking-tight lg:text-5xl">{children}</h1>
  )
}
