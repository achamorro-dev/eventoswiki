import { actions } from 'astro:actions'
import { useState } from 'react'
import { Button } from '@/ui/button'
import { HeartBold, HeartBreakBold, Loader } from '@/ui/icons'

interface Props {
  organizationId: string
  isFollowing: boolean
  minimal?: boolean
}
export const OrganizationFollowButton = (props: Props) => {
  const { organizationId, minimal = false } = props
  const [isFollowing, setIsFollowing] = useState(props.isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const follow = async () => {
    setIsLoading(true)
    await actions.organizations.followOrganizationAction({
      organizationId,
    })

    setIsFollowing(true)
    setIsLoading(false)
  }

  const unfollow = async () => {
    setIsLoading(true)
    await actions.organizations.unfollowOrganizationAction({
      organizationId,
    })

    setIsFollowing(false)
    setIsLoading(false)
  }

  return (
    <Button
      variant={minimal ? 'ghost' : 'secondary'}
      size={minimal ? 'sm' : 'default'}
      className={
        minimal
          ? '-ml-1 mt-1 h-6 gap-1 px-2 text-muted-foreground text-xs hover:text-foreground [&_svg]:size-3'
          : undefined
      }
      aria-label="Seguir organización"
      onClick={isFollowing ? unfollow : follow}
      disabled={isLoading}
    >
      {isLoading && (
        <>
          <Loader className="animate-spin" /> Guardando
        </>
      )}
      {!isLoading && (isFollowing ? <HeartBreakBold /> : <HeartBold />)}
      {!isLoading && (isFollowing ? 'Dejar de seguir' : 'Seguir')}
    </Button>
  )
}
