import type { FC, ReactNode } from 'react'
import type { SocialNetwork } from '../../../social/social-network'
import { Facebook, Github, Instagram, Linkedin, Twitch, Twitter, Youtube } from '../../../ui/icons'

type SocialLinkProps = {
  href: string
  type: SocialNetwork
  name: string
}

const SocialLinkIcon: { [key in SocialNetwork]: ReactNode } = {
  twitter: <Twitter style={{ color: '#00acee' }} />,
  linkedin: <Linkedin style={{ color: '#0072b1' }} />,
  youtube: <Youtube style={{ color: '#ff0000' }} />,
  twitch: <Twitch style={{ color: '#6441a5' }} />,
  facebook: <Facebook style={{ color: '#0866FF' }} />,
  instagram: <Instagram style={{ color: '#E1306C' }} />,
  github: <Github style={{ color: '#24292e' }} />,
}

export const SocialLink: FC<SocialLinkProps> = props => {
  const { href, type, name } = props
  return (
    <a
      href={href}
      target="_blank"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 bg-white text-xl shadow-xl"
      rel="nofollow"
      aria-label={`Enlace a ${type} de ${name}`}
    >
      {SocialLinkIcon[type]}
    </a>
  )
}
