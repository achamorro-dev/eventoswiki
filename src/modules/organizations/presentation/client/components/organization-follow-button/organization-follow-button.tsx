import { actions } from 'astro:actions'
import { useState } from 'react'
import { Button } from '@/ui/button'
import { HeartBold, HeartBreakBold, Loader } from '@/ui/icons'

interface Props {
  organizationId: string
  userId: string
  isFollowing: boolean
}
export const OrganizationFollowButton = (props: Props) => {
  const { organizationId, userId } = props
  const [isFollowing, setIsFollowing] = useState(props.isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const follow = async () => {
    setIsLoading(true)
    await actions.organizations.followOrganizationAction({
      organizationId,
      userId,
    })

    setIsFollowing(true)
    setIsLoading(false)
  }

  const unfollow = async () => {
    setIsLoading(true)
    await actions.organizations.unfollowOrganizationAction({
      organizationId,
      userId,
    })

    setIsFollowing(false)
    setIsLoading(false)
  }

  return (
    <Button
      variant="secondary"
      aria-label="Seguir organización"
      onClick={isFollowing ? unfollow : follow}
      disabled={isLoading}
    >
      {isLoading && (
        <>
          <Loader className="animate-spin" /> Guardando
        </>
      )}
      {!isLoading && (isFollowing ? <HeartBreakBold /> : <HeartBold />)}{' '}
      {!isLoading && (isFollowing ? 'Dejar de seguir' : 'Seguir')}
    </Button>
  )
}
