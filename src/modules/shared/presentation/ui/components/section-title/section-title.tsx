import type { PropsWithChildren } from 'react'

export const SectionTitle = ({ children }: PropsWithChildren) => {
  return <h2 className="mb-4 font-semibold text-3xl text-foreground leading-none tracking-tight">{children}</h2>
}
