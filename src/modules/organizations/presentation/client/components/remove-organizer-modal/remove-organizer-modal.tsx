import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { Trash2 } from 'lucide-react'
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
} from '@/modules/shared/presentation/ui/alert-dialog'
import { Button } from '@/modules/shared/presentation/ui/button'

interface RemoveOrganizerModalProps {
  organizationId: string
  organizerId: string
  organizerName: string
}

export const RemoveOrganizerModal: FC<RemoveOrganizerModalProps> = ({ organizationId, organizerId, organizerName }) => {
  const onRemove = async () => {
    const { error } = await actions.organizations.removeOrganizerAction({
      organizationId,
      organizerIdToRemove: organizerId,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(`${organizerName} ha sido eliminado como organizador`)
    await navigate(window.location.pathname)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar organizador</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar a <strong>{organizerName}</strong> como organizador de esta
            organización?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onRemove}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
