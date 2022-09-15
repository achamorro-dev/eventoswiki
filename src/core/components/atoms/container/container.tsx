import type { FC, PropsWithChildren } from 'react'

export const Container: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className='w-full px-6 pb-12 antialiased bg-white'>
      <div className='mx-auto max-w-7xl'>{children}</div>
    </div>
  )
}
