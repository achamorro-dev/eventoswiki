'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/shared/presentation/ui/avatar'
import { Button } from '@/modules/shared/presentation/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/modules/shared/presentation/ui/command'
import { DialogTitle } from '@/modules/shared/presentation/ui/dialog'

interface AddOrganizerModalProps {
  organizationId: string
}

interface UserSearchResult {
  id: string
  name: string
  username: string
  email: string | null
  avatar: string | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AddOrganizerModal({ organizationId }: AddOrganizerModalProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery)

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (searchQuery.length < 3) {
        setUsers([])
        return
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setLoading(true)
        const { data, error } = await actions.user.searchUsersAction({
          query: searchQuery,
          organizationId,
        })

        if (error) {
          toast.error('Error al buscar usuarios')
          setLoading(false)
          return
        }

        setUsers(data?.users ?? [])
        setLoading(false)
      }, 300)
    },
    [organizationId],
  )

  const handleSelectUser = async (user: UserSearchResult) => {
    const { error } = await actions.organizations.addOrganizerAction({
      organizationId,
      organizerId: user.id,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(`${user.name} ha sido añadido como organizador`)
    setOpen(false)
    setQuery('')
    setUsers([])
    await navigate(window.location.pathname)
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir organizador
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Añadir organizador</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Buscar usuarios por nombre, username o email..."
            value={query}
            onValueChange={handleSearch}
          />
          <CommandList>
            {query && <CommandEmpty>{loading ? 'Buscando...' : 'No se encontraron resultados'}</CommandEmpty>}
            {users.length > 0 && (
              <CommandGroup heading="Usuarios">
                {users.map(user => (
                  <CommandItem key={user.id} onSelect={() => handleSelectUser(user)} className="cursor-pointer">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-muted-foreground text-xs">@{user.username}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
