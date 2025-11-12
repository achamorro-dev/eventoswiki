import type { PropsWithChildren } from 'react'

export const SectionTitle = ({ children }: PropsWithChildren) => {
  return <h2 className="text-primary mb-4 text-3xl font-semibold leading-none">{children}</h2>
}
