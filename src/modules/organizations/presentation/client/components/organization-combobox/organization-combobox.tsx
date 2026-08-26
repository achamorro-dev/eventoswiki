'use client'

import { actions } from 'astro:actions'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/ui/command'
import { Buildings, Check, ChevronDown, Loader } from '@/ui/icons'
import { cn } from '@/ui/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

export interface OrganizationComboboxOption {
  id: string
  handle: string
  name: string
  image?: string
}

interface Props {
  id?: string
  value?: string
  organizations: OrganizationComboboxOption[]
  allowEmpty?: boolean
  enableRemoteSearch?: boolean
  disabled?: boolean
  className?: string
  onChange: (organizationId: string | undefined) => void
}

const REMOTE_SEARCH_DEBOUNCE_MS = 300
const REMOTE_SEARCH_MIN_LENGTH = 2
const REMOTE_SEARCH_RESULTS_LIMIT = 10
const NO_ORGANIZATION_VALUE = '__no_organization__'

export function OrganizationCombobox({
  id,
  value,
  organizations,
  allowEmpty = false,
  enableRemoteSearch = false,
  disabled = false,
  className,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [remoteOrganizations, setRemoteOrganizations] = useState<OrganizationComboboxOption[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedOption, setSelectedOption] = useState<OrganizationComboboxOption | undefined>(() =>
    organizations.find(organization => organization.id === value),
  )
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery)

      if (!enableRemoteSearch) return

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (searchQuery.length < REMOTE_SEARCH_MIN_LENGTH) {
        setRemoteOrganizations([])
        setIsSearching(false)
        return
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true)
        const { data, error } = await actions.organizations.searchOrganizationsAction({
          query: searchQuery,
          limit: REMOTE_SEARCH_RESULTS_LIMIT,
        })

        if (error) {
          toast.error('Error al buscar organizaciones')
          setIsSearching(false)
          return
        }

        setRemoteOrganizations(data?.organizations ?? [])
        setIsSearching(false)
      }, REMOTE_SEARCH_DEBOUNCE_MS)
    },
    [enableRemoteSearch],
  )

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const visibleOrganizations =
    enableRemoteSearch && query.length >= REMOTE_SEARCH_MIN_LENGTH ? remoteOrganizations : organizations

  const selectOrganization = (organization: OrganizationComboboxOption | undefined) => {
    setSelectedOption(organization)
    onChange(organization?.id)
    setOpen(false)
    setQuery('')
    setRemoteOrganizations([])
  }

  const triggerLabel = selectedOption?.name ?? (allowEmpty ? 'Sin organización' : 'Selecciona una organización')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', !selectedOption && 'text-muted-foreground', className)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Buildings className="h-4 w-4 shrink-0" />
            <span className="truncate">{triggerLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={!enableRemoteSearch}>
          <CommandInput placeholder="Buscar organización..." value={query} onValueChange={handleSearch} />
          <CommandList>
            {enableRemoteSearch && isSearching ? (
              <div className="flex items-center gap-2 py-6 text-center text-muted-foreground text-sm">
                <Loader className="h-4 w-4 animate-spin" /> Buscando organizaciones...
              </div>
            ) : (
              <CommandEmpty>No se encontraron organizaciones</CommandEmpty>
            )}
            {allowEmpty && (
              <CommandGroup>
                <CommandItem value={NO_ORGANIZATION_VALUE} onSelect={() => selectOrganization(undefined)}>
                  <Buildings className="h-4 w-4" />
                  Sin organización
                  {!selectedOption && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              </CommandGroup>
            )}
            {visibleOrganizations.length > 0 && (
              <CommandGroup heading={enableRemoteSearch ? 'Resultados' : 'Tus organizaciones'}>
                {visibleOrganizations.map(organization => (
                  <CommandItem
                    key={organization.id}
                    value={organization.id}
                    keywords={[organization.name, organization.handle]}
                    onSelect={() => selectOrganization(organization)}
                  >
                    {organization.image ? (
                      <img src={organization.image} alt="" className="h-4 w-4 rounded-sm object-cover" />
                    ) : (
                      <Buildings className="h-4 w-4" />
                    )}
                    {organization.name}
                    {selectedOption?.id === organization.id && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
