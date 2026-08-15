'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { type ComponentType, useEffect, useState } from 'react'
import { PiBuildings, PiClockCounterClockwise } from 'react-icons/pi'
import type { GlobalSearchResultsDto, SearchItemDto } from '@/search/presentation/types/search-results.dto'
import { isEmptyGlobalSearchResults } from '@/search/presentation/types/search-results.dto'
import { Button } from '@/ui/button'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/ui/command'
import { Calendar, CalendarBlank, Loader, MapPin, Plus, Search, Users } from '@/ui/icons'
import { Urls } from '@/ui/urls/urls'

const DEBOUNCE_MILLISECONDS = 300
const MIN_SEARCH_LENGTH = 2
const MAX_RECENTS = 5
const RECENTS_STORAGE_KEY = 'eventoswiki:command-palette:recents'

interface NavigationCommand {
  id: string
  title: string
  url: string
  keywords: string
  icon: ComponentType<{ className?: string }>
}

const navigationCommands: NavigationCommand[] = [
  {
    id: 'navigate-events',
    title: 'Eventos',
    url: Urls.EVENTS,
    keywords: 'eventos conferencias charlas próximos',
    icon: Calendar,
  },
  {
    id: 'navigate-meetups',
    title: 'Meetups',
    url: Urls.MEETUPS,
    keywords: 'meetups comunidades quedadas',
    icon: Users,
  },
  {
    id: 'navigate-organizations',
    title: 'Organizaciones',
    url: Urls.ORGANIZATIONS,
    keywords: 'organizaciones comunidades grupos',
    icon: PiBuildings,
  },
  {
    id: 'navigate-calendar',
    title: 'Calendario',
    url: Urls.CALENDAR,
    keywords: 'calendario agenda fechas',
    icon: CalendarBlank,
  },
  {
    id: 'navigate-create-event',
    title: 'Crear evento',
    url: Urls.EVENTS_CREATE,
    keywords: 'crear nuevo evento publicar',
    icon: Plus,
  },
  {
    id: 'navigate-create-meetup',
    title: 'Crear meetup',
    url: Urls.MEETUPS_CREATE,
    keywords: 'crear nuevo meetup publicar',
    icon: Plus,
  },
  {
    id: 'navigate-create-organization',
    title: 'Crear organización',
    url: Urls.CREATE_ORGANIZATION,
    keywords: 'crear nueva organización comunidad',
    icon: Plus,
  },
]

const readRecents = (): SearchItemDto[] => {
  try {
    const storedRecents = localStorage.getItem(RECENTS_STORAGE_KEY)
    return storedRecents ? (JSON.parse(storedRecents) as SearchItemDto[]) : []
  } catch {
    return []
  }
}

const saveRecent = (item: SearchItemDto): SearchItemDto[] => {
  const remainingRecents = readRecents().filter(recent => recent.url !== item.url)
  const updatedRecents = [item, ...remainingRecents].slice(0, MAX_RECENTS)

  try {
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(updatedRecents))
  } catch {
    // El almacenamiento puede no estar disponible en navegadores privados: las búsquedas recientes son best-effort.
  }

  return updatedRecents
}

const toSearchItem = (command: NavigationCommand): SearchItemDto => ({
  id: command.id,
  title: command.title,
  url: command.url,
  subtitle: null,
})

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GlobalSearchResultsDto | null>(null)
  const [recents, setRecents] = useState<SearchItemDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setRecents(readRecents())
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsOpen(current => !current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const trimmedQuery = query.trim()

    if (trimmedQuery.length > 0 && trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setResults(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timer = setTimeout(async () => {
      setError(null)

      try {
        const { data, error: actionError } = await actions.search.searchAction({ query: trimmedQuery })

        if (actionError) {
          setError(actionError.message)
          setResults(null)
          return
        }

        setResults(data)
      } catch {
        setError('No se ha podido completar la búsqueda')
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MILLISECONDS)

    return () => clearTimeout(timer)
  }, [isOpen, query])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setQuery('')
  }

  const handleSelect = (item: SearchItemDto) => {
    setRecents(saveRecent(item))
    handleOpenChange(false)
    navigate(item.url)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const isSearchMode = normalizedQuery.length >= MIN_SEARCH_LENGTH
  const hasResults = results !== null && !isEmptyGlobalSearchResults(results)

  const matchingCommands = navigationCommands.filter(
    command =>
      !isSearchMode ||
      command.title.toLowerCase().includes(normalizedQuery) ||
      command.keywords.includes(normalizedQuery),
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Buscar en eventos.wiki"
        aria-keyshortcuts="Meta+K Control+K"
      >
        <Search className="size-5" />
      </Button>

      <CommandDialog open={isOpen} onOpenChange={handleOpenChange} shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          withFocusRing={false}
          placeholder="Buscar eventos, meetups, organizaciones..."
        />
        <CommandList className="max-h-[400px]">
          {isLoading && <LoadingIndicator />}
          {!isLoading && error && <CommandEmpty>{error}</CommandEmpty>}
          {!isLoading && !error && isSearchMode && !hasResults && (
            <CommandEmpty>Sin resultados para «{query.trim()}»</CommandEmpty>
          )}
          {!isLoading && !error && (
            <>
              {!isSearchMode && recents.length > 0 && (
                <CommandGroup heading="Búsquedas recientes">
                  {recents.map(recent => (
                    <CommandItem key={`recent-${recent.url}`} onSelect={() => handleSelect(recent)}>
                      <PiClockCounterClockwise />
                      <ResultItemContent item={recent} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {matchingCommands.length > 0 && (
                <CommandGroup heading="Navegación">
                  {matchingCommands.map(command => {
                    const Icon = command.icon
                    return (
                      <CommandItem key={command.id} onSelect={() => handleSelect(toSearchItem(command))}>
                        <Icon />
                        <span>{command.title}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
              {results && <ResultsGroups results={results} onSelect={handleSelect} />}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

const LoadingIndicator = () => (
  <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
    <Loader className="size-4 animate-spin" />
    <span>Buscando...</span>
  </div>
)

const ResultItemContent = ({ item }: { item: SearchItemDto }) => (
  <div className="flex flex-col">
    <span>{item.title}</span>
    {item.subtitle && <span className="text-muted-foreground text-xs">{item.subtitle}</span>}
  </div>
)

const ResultsGroups = ({
  results,
  onSelect,
}: {
  results: GlobalSearchResultsDto
  onSelect: (item: SearchItemDto) => void
}) => (
  <>
    <ResultGroup heading="Eventos próximos" items={results.events.upcoming} icon={Calendar} onSelect={onSelect} />
    <ResultGroup heading="Meetups próximos" items={results.meetups.upcoming} icon={Users} onSelect={onSelect} />
    <ResultGroup heading="Organizaciones" items={results.organizations} icon={PiBuildings} onSelect={onSelect} />
    <ResultGroup heading="Provincias" items={results.provinces} icon={MapPin} onSelect={onSelect} />
    <ResultGroup heading="Eventos pasados" items={results.events.past} icon={Calendar} onSelect={onSelect} />
    <ResultGroup heading="Meetups pasados" items={results.meetups.past} icon={Users} onSelect={onSelect} />
  </>
)

const ResultGroup = ({
  heading,
  items,
  icon: Icon,
  onSelect,
}: {
  heading: string
  items: SearchItemDto[]
  icon: ComponentType<{ className?: string }>
  onSelect: (item: SearchItemDto) => void
}) => {
  if (items.length === 0) return null

  return (
    <CommandGroup heading={heading}>
      {items.map(item => (
        <CommandItem key={item.id} onSelect={() => onSelect(item)}>
          <Icon />
          <ResultItemContent item={item} />
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
