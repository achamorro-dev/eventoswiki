import type { PropsWithChildren } from 'react'

export const SectionTitle = ({ children }: PropsWithChildren) => {
  return <h2 className="text-primary text-4xl font-medium leading-none lg:text-5xl">{children}</h2>
}
