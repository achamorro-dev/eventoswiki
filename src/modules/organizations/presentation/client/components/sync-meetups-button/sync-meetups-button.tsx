import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { ExternalMeetupPreview } from '@/meetups/application/get-external-meetups.query'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import { ArrowsClockwise, Loader } from '@/ui/icons'
import { Urls } from '@/ui/urls/urls'

interface Props {
  organizationId: string
  organizationHandle: string
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

const toFallbackImage = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = '/not-found.jpg'
}

const isUpcoming = (meetup: ExternalMeetupPreview) => new Date(meetup.startsAt).getTime() >= Date.now()

const formatStartsAt = (startsAt: string) => dateFormatter.format(new Date(startsAt))

export const SyncMeetupsButton = ({ organizationId, organizationHandle }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null)
  const [previews, setPreviews] = useState<ExternalMeetupPreview[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSyncing, setIsSyncing] = useState(false)

  const { upcomingMeetups, pastMeetups } = useMemo(() => {
    const upcoming = previews
      .filter(isUpcoming)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    const past = previews
      .filter(meetup => !isUpcoming(meetup))
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())

    return { upcomingMeetups: upcoming, pastMeetups: past }
  }, [previews])

  const loadExternalMeetups = async () => {
    setIsLoading(true)
    setLoadErrorMessage(null)

    const { data, error } = await actions.meetups.getExternalMeetupsAction({ organizationId })

    setIsLoading(false)

    if (error) {
      setLoadErrorMessage(error.message)
      return
    }

    setPreviews(data)
    setSelectedIds(new Set(data.filter(isUpcoming).map(meetup => meetup.externalId)))
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) return

    setPreviews([])
    setSelectedIds(new Set())
    loadExternalMeetups()
  }

  const toggleMeetup = (externalId: string, checked: boolean) => {
    setSelectedIds(previous => {
      const next = new Set(previous)

      if (checked) {
        next.add(externalId)
      } else {
        next.delete(externalId)
      }

      return next
    })
  }

  const selectAll = () => setSelectedIds(new Set(previews.map(meetup => meetup.externalId)))

  const selectNone = () => setSelectedIds(new Set())

  const syncSelected = async () => {
    setIsSyncing(true)

    const { data, error } = await actions.meetups.syncMeetupsFromMeetupAction({
      organizationId,
      externalIds: [...selectedIds],
    })

    setIsSyncing(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setIsOpen(false)
    toast.success(`Sincronización completada: ${data.created} meetups nuevos y ${data.updated} actualizados`)
    navigate(Urls.ORGANIZATION_MEETUPS(organizationHandle))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowsClockwise /> Sincronizar con Meetup.com
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Sincronizar con Meetup.com</DialogTitle>
          <DialogDescription>Selecciona los meetups del grupo que quieres sincronizar.</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader className="animate-spin" /> Cargando los meetups de Meetup.com…
          </div>
        )}

        {loadErrorMessage && (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-destructive text-sm">{loadErrorMessage}</p>
            <Button variant="outline" onClick={loadExternalMeetups}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !loadErrorMessage && previews.length === 0 && (
          <p className="py-10 text-center text-muted-foreground text-sm">
            No se han encontrado meetups en el grupo de Meetup.com.
          </p>
        )}

        {!isLoading && !loadErrorMessage && previews.length > 0 && (
          <>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll} disabled={isSyncing}>
                Seleccionar todos
              </Button>
              <Button variant="ghost" size="sm" onClick={selectNone} disabled={isSyncing}>
                Ninguno
              </Button>
            </div>
            <div className="max-h-[50vh] space-y-6 overflow-y-auto pr-1">
              <MeetupPreviewGroup
                title="Próximos"
                meetups={upcomingMeetups}
                selectedIds={selectedIds}
                disabled={isSyncing}
                onToggle={toggleMeetup}
              />
              {pastMeetups.length > 0 && (
                <MeetupPreviewGroup
                  title="Pasados"
                  meetups={pastMeetups}
                  selectedIds={selectedIds}
                  disabled={isSyncing}
                  onToggle={toggleMeetup}
                />
              )}
            </div>
          </>
        )}

        <DialogFooter className="items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            {selectedIds.size} seleccionado{selectedIds.size === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSyncing}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={syncSelected} disabled={selectedIds.size === 0 || isSyncing}>
              {isSyncing && <Loader className="animate-spin" />}
              Sincronizar {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface MeetupPreviewGroupProps {
  title: string
  meetups: ExternalMeetupPreview[]
  selectedIds: Set<string>
  disabled: boolean
  onToggle: (externalId: string, checked: boolean) => void
}

const MeetupPreviewGroup = ({ title, meetups, selectedIds, disabled, onToggle }: MeetupPreviewGroupProps) => {
  if (meetups.length === 0) {
    return null
  }

  return (
    <section>
      <h4 className="mb-2 font-semibold text-muted-foreground text-sm">
        {title} ({meetups.length})
      </h4>
      <ul className="space-y-2">
        {meetups.map(meetup => (
          <li key={meetup.externalId}>
            <label
              htmlFor={`sync-meetup-${meetup.externalId}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent/50"
            >
              <Checkbox
                id={`sync-meetup-${meetup.externalId}`}
                checked={selectedIds.has(meetup.externalId)}
                onCheckedChange={checked => onToggle(meetup.externalId, checked === true)}
                disabled={disabled}
              />
              <img
                className="h-10 w-16 shrink-0 rounded object-cover"
                src={meetup.imageUrl ?? '/not-found.jpg'}
                alt=""
                loading="lazy"
                onError={toFallbackImage}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-sm">{meetup.title}</span>
                <span className="block text-muted-foreground text-xs">{formatStartsAt(meetup.startsAt)}</span>
              </span>
              {meetup.isImported ? (
                <Badge variant="secondary">Ya importado</Badge>
              ) : (
                <Badge variant="success">Nuevo</Badge>
              )}
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
