import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Urls } from '@/ui/urls/urls'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import type { FC } from 'react'
import { toast } from 'sonner'

interface Props {
  meetupId: string
}

export const DeleteMeetupModal: FC<Props> = ({ meetupId }) => {
  const onDelete = async () => {
    const { error } = await actions.meetups.deleteMeetupAction({
      meetupId,
    })
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Meetup eliminado correctamente')
    navigate(Urls.MEMBER_ORGANIZATIONS)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar meetup</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar el meetup? Esta acción es irreversible y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
