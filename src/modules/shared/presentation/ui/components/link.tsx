import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/modules/shared/presentation/ui/lib/utils'
import { buttonVariants } from './button'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Link({ className, variant, size, asChild = false, ...props }: LinkProps) {
  const Comp = asChild ? Slot : 'a'

  return <Comp data-slot="link" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Link }
