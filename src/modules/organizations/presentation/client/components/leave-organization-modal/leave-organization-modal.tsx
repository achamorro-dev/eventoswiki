import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { LogOut } from 'lucide-react'
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

interface LeaveOrganizationModalProps {
  organizationId: string
  organizationName: string
}

export const LeaveOrganizationModal: FC<LeaveOrganizationModalProps> = ({ organizationId, organizationName }) => {
  const onLeave = async () => {
    const { error } = await actions.organizations.leaveOrganizationAction({
      organizationId,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Has abandonado la organización')
    navigate('/me/organizations', { history: 'replace' })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Abandonar organización</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres abandonar <strong>{organizationName}</strong>? Perderás acceso de organizador.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onLeave}>Abandonar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
