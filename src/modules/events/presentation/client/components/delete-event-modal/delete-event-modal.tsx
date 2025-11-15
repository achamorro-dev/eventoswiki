import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import type { FC } from 'react'
import { toast } from 'sonner'
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

interface Props {
  eventId: string
}

export const DeleteEventModal: FC<Props> = ({ eventId }) => {
  const onDelete = async () => {
    const { error } = await actions.events.deleteEventAction({
      eventId,
    })
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Evento eliminado correctamente')
    navigate(Urls.MEMBER_ORGANIZATIONS)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar evento</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar el evento? Esta acción es irreversible y no se puede deshacer.
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
