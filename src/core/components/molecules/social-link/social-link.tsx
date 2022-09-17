import type { FC, ReactNode } from 'react'
import type { SocialNetwork } from '../../../social/social-network'
import { Facebook } from '../../atoms/icons/Facebook'
import { Twitch } from '../../atoms/icons/twitch'
import { Twitter } from '../../atoms/icons/Twitter'

type SocialLinkProps = {
  href: string
  type: SocialNetwork
}

const SocialLinkIcon: { [key in SocialNetwork]: ReactNode } = {
  twitter: <Twitter />,
  linkedin: undefined,
  youtube: undefined,
  twitch: <Twitch />,
  facebook: <Facebook />,
  instagram: undefined,
}

export const SocialLink: FC<SocialLinkProps> = (props) => {
  const { href, type } = props
  return (
    <a
      href={href}
      target='_blank'
      className='w-10 h-10 rounded-full flex justify-center items-center bg-white border border-gray-400 shadow-xl'
    >
      {SocialLinkIcon[type]}
    </a>
  )
}
