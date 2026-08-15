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
} from '@/ui/alert-dialog'
import { Urls } from '@/ui/urls/urls'

interface Props {
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteEventModal: FC<Props> = ({ eventId, open, onOpenChange }) => {
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
