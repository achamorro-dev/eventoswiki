import type { SocialNetwork } from '@/shared/domain/social/social-network'
import type { FC, ReactNode } from 'react'
import {
  Discord,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Telegram,
  Tiktok,
  Twitch,
  Whatsapp,
  XLogo,
  Youtube,
} from '../../../ui/icons'

type SocialLinkProps = {
  href: string
  type: SocialNetwork
  name: string
}

const SocialLinkIcon: { [key in SocialNetwork]: ReactNode } = {
  twitter: <XLogo />,
  linkedin: <Linkedin />,
  youtube: <Youtube size={24} />,
  twitch: <Twitch />,
  facebook: <Facebook size={24} />,
  instagram: <Instagram />,
  github: <Github />,
  telegram: <Telegram />,
  whatsapp: <Whatsapp />,
  discord: <Discord />,
  tiktok: <Tiktok />,
  web: <Globe />,
}

export const SocialLink: FC<SocialLinkProps> = props => {
  const { href, type, name } = props
  return (
    <a
      href={href}
      target="_blank"
      className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
      rel="nofollow"
      title={`${type.toUpperCase()}`}
      aria-label={`Enlace a ${type} de ${name}`}
    >
      {SocialLinkIcon[type]}
    </a>
  )
}
