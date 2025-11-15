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
  organizationId: string
}

export const DeleteOrganizationModal: FC<Props> = ({ organizationId }) => {
  const onDelete = async () => {
    const { error } = await actions.organizations.deleteOrganizationAction({
      organizationId,
    })
    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Organización eliminada correctamente')
    navigate(Urls.MEMBER_ORGANIZATIONS)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar organización</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar la organización? Esta acción es irreversible y no se puede deshacer.
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
