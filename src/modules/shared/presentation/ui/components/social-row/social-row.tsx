import { SocialNetwork } from '@/shared/domain/social/social-network'
import { SocialLink } from '../social-link/social-link'
import { cn } from '@/ui/lib/utils'

interface Props {
  name: string
  twitter?: string
  twitch?: string
  instagram?: string
  youtube?: string
  facebook?: string
  linkedin?: string
  github?: string
  telegram?: string
  whatsapp?: string
  discord?: string
  web?: string
  className?: string
}

export const SocialRow = (props: Props) => {
  const {
    twitter,
    twitch,
    instagram,
    youtube,
    facebook,
    linkedin,
    github,
    telegram,
    whatsapp,
    discord,
    web,
    className,
  } = props

  return (
    <div className={cn('left-0 right-0 -ml-2 flex w-full justify-start gap-1 xl:px-0', className)}>
      {web && <SocialLink name={web} href={web} type={SocialNetwork.web} />}
      {twitter && <SocialLink name={twitter} href={twitter} type={SocialNetwork.twitter} />}
      {twitch && <SocialLink name={twitch} href={twitch} type={SocialNetwork.twitch} />}
      {instagram && <SocialLink name={instagram} href={instagram} type={SocialNetwork.instagram} />}
      {youtube && <SocialLink name={youtube} href={youtube} type={SocialNetwork.youtube} />}
      {facebook && <SocialLink name={facebook} href={facebook} type={SocialNetwork.facebook} />}
      {linkedin && <SocialLink name={linkedin} href={linkedin} type={SocialNetwork.linkedin} />}
      {github && <SocialLink name={github} href={github} type={SocialNetwork.github} />}
      {telegram && <SocialLink name={telegram} href={telegram} type={SocialNetwork.telegram} />}
      {whatsapp && <SocialLink name={whatsapp} href={whatsapp} type={SocialNetwork.whatsapp} />}
      {discord && <SocialLink name={discord} href={discord} type={SocialNetwork.discord} />}
    </div>
  )
}
