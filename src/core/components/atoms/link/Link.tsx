import type { FC, PropsWithChildren } from 'react'

type LinkProps = {
  href: string
}

export const Link: FC<PropsWithChildren<LinkProps>> = (props) => {
  const { href, children } = props

  return (
    <a
      href={href}
      className='inline-block w-full py-2 mx-0 ml-6 font-medium text-left text-gray-600 md:ml-0 md:w-auto md:px-0 md:mx-2 lg:mx-3 md:text-center'
    >
      {children}
    </a>
  )
}
