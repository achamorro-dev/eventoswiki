import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  description: ReactNode
  icon?: React.ElementType
}
export const EmptyMessage = ({ title, description, icon }: Props) => {
  const Comp = (icon as React.ElementType) || undefined
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {Comp && (
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <Comp className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
