import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import { DeleteEventModal } from '@/events/presentation/client/components/delete-event-modal/delete-event-modal'
import { DeleteMeetupModal } from '@/meetups/presentation/client/components/delete-meetup-modal/delete-meetup-modal'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Copy, DotsThreeVerticalBold, Pencil, Trash } from '@/ui/icons'
import { Urls } from '@/ui/urls/urls'

interface Props {
  type: 'event' | 'meetup'
  slug: string
  entityId: string
  organizationHandle?: string
}

export const EventActionsMenu = ({ type, slug, entityId, organizationHandle }: Props) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const editUrl = type === 'meetup' ? Urls.MEETUP_EDIT(slug) : Urls.EVENT_EDIT(slug)
  const duplicateUrl =
    type === 'event' && organizationHandle
      ? `${Urls.CREATE_EVENT(organizationHandle)}?duplicate=${entityId}`
      : undefined

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label="Administrar">
            <DotsThreeVerticalBold />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigate(editUrl)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          {duplicateUrl && (
            <DropdownMenuItem onSelect={() => navigate(duplicateUrl)}>
              <Copy />
              Duplicar
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={event => {
              event.preventDefault()
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {type === 'meetup' ? (
        <DeleteMeetupModal meetupId={entityId} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      ) : (
        <DeleteEventModal eventId={entityId} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      )}
    </>
  )
}
