'use client'

import { actions } from 'astro:actions'
import { Loader2, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Place } from '@/modules/places/domain/place'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/ui/command'
import { InputError } from '@/ui/components/form/input-error/input-error'
import { cn } from '@/ui/lib/utils'
import { PlaceEmbedMap } from '../place-embed-map/place-embed-map'

interface PlaceSearchProps {
  onPlaceSelect?: (place: Primitives<Place>) => void
  placeholder?: string
  className?: string
  value?: Primitives<Place>
}

const examplePlaces: Primitives<Place>[] = [
  {
    id: '1',
    name: 'Lugar 1',
    address: 'Dirección 1',
  },
  {
    id: '2',
    name: 'Lugar 2',
    address: 'Dirección 2',
  },
  {
    id: '3',
    name: 'Lugar 3',
    address: 'Dirección 3',
  },
]

export const PlaceSearch = ({
  onPlaceSelect,
  placeholder = 'Escribe la dirección o el nombre del lugar...',
  className,
  value,
}: PlaceSearchProps) => {
  const [query, setQuery] = useState(value?.name || '')
  const [results, setResults] = useState<Primitives<Place>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (value?.name === query) {
      return
    }

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setShowResults(false)
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)

    const timer = setTimeout(async () => {
      setError(null)

      try {
        const { data, error: actionError } = await actions.places.searchPlacesAction({
          query: trimmedQuery,
        })

        if (actionError) {
          setError(actionError.message)
          setResults([])
          return
        }

        setResults(data || [])
      } catch (_err) {
        setError('Se ha producido un error en la búsqueda')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, setError, setResults, setIsLoading])

  useEffect(() => {
    if (value?.name !== undefined && value.name !== query) {
      setQuery(value.name)
    }
  }, [value])

  const handleSelect = (place: Primitives<Place>) => {
    onPlaceSelect?.(place)
    setResults([])
    setShowResults(false)
  }

  return (
    <Command shouldFilter={false} className={cn('relative overflow-visible', className)} ref={containerRef}>
      <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder} />
      <CommandList
        className={cn('absolute w-full bg-background top-[calc(100%+4px)] rounded-md', {
          'border border-input': showResults,
        })}
      >
        {showResults &&
          !isLoading &&
          results.length > 0 &&
          results.map(place => (
            <CommandItem key={place.id} onSelect={() => handleSelect(place)}>
              <MapPin className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <div className="font-medium">{place.name}</div>
                {place.address && <div className="text-muted-foreground text-xs">{place.address}</div>}
              </div>
            </CommandItem>
          ))}
        {showResults && isLoading && (
          <CommandEmpty>
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Buscando...</span>
            </div>
          </CommandEmpty>
        )}
        {showResults && !isLoading && results.length === 0 && !error && (
          <CommandEmpty>No existen resultados para la búsqueda</CommandEmpty>
        )}
        {showResults && error && (
          <CommandEmpty>
            <InputError>{error}</InputError>
          </CommandEmpty>
        )}
      </CommandList>
    </Command>
  )
}
