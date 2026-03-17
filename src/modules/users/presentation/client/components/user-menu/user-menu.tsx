'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/modules/shared/presentation/ui/avatar'
import { Link } from '@/modules/shared/presentation/ui/components/link'
import { ThemeModeToggle } from '@/modules/shared/presentation/ui/components/theme-mode-toggle/theme-mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/shared/presentation/ui/dropdown-menu'
import { Urls } from '@/modules/shared/presentation/ui/urls/urls'

interface UserMenuProps {
  userName: string
  email: string
  avatarUrl: string | null
}

export function UserMenu({ userName, email, avatarUrl }: UserMenuProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Menú de usuario"
        >
          <Avatar className="size-10">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={`Avatar de ${userName}`} />}
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 px-2 py-1.5">
          <p className="font-medium text-sm">{userName}</p>
          <p className="text-muted-foreground text-xs">{email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.PROFILE}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <ThemeModeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={Urls.CREATE_ORGANIZATION}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Crear organización
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.EVENTS_CREATE}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Crear evento
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.MEETUPS_CREATE}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Crear meetup
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={Urls.MY_MEETUPS}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Mis meetups
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.MY_ORGANIZATIONS}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Mis organizaciones
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={Urls.FEATURE_REQUEST}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Solicita una funcionalidad
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.BUG_REPORT}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Reporta un error
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.CHANGELOG}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Changelog
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={Urls.SETTINGS}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
          >
            Ajustes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={Urls.LOGOUT}
            variant="ghost"
            className="w-full justify-start focus-visible:border-none focus-visible:ring-0"
            data-astro-prefetch="false"
          >
            Cerrar sesión
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
