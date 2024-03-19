import { useState, type FC } from 'react'
import { Button } from '../../atoms/button/button'
import { Close } from '../../atoms/icons/close'
import { HamburgerMenu } from '../../atoms/icons/hamburger-menu'
import { Link } from '../../atoms/link/link'
import { Logo } from '../logo/logo'
import { ThemeModeToggle } from '../theme-mode-toggle/theme-mode-toggle'

export const Menu: FC = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <div
        className={`top-0 left-0 items-start w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 lg:text-base md:bg-transparent md:p-0 md:relative md:flex ${
          showMenu ? 'flex fixed' : 'hidden'
        }`}
      >
        <div className="flex-col w-full h-auto overflow-hidden rounded-lg bg-white dark:bg-slate-600 md:bg-transparent md:dark:bg-transparent md:overflow-visible md:rounded-none md:relative md:flex md:flex-row md:justify-end">
          <Logo className="ml-5 md:hidden" />
          <div className="flex flex-col items-start justify-center w-full space-x-6 mb-4 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:mb-0 md:mr-4 md:flex-row md:items-center md:justify-end ">
            <Link href="/eventos/1">Eventos</Link>
            <Link href="/meetups/1">Meetups</Link>
            <Link href="/calendario">Calendario</Link>
            <Button
              variant="text"
              type="link"
              href="https://github.com/achamorro-dev/eventoswiki/issues/new?assignees=achamorro-dev&labels=enhancement&template=solicitud-nuevo-evento.md&title=A%C3%B1adir+nuevo+evento"
              rel="nofollow"
              className="hidden !ml-0 lg:!ml-4 md:block"
              target="_blank"
            >
              Añadir evento
            </Button>
          </div>
        </div>
        <ThemeModeToggle className="hidden md:flex" />
      </div>

      {showMenu && (
        <ThemeModeToggle
          className="relative right-8 md:hidden"
          onClick={() => setTimeout(() => setShowMenu(false), 0)}
        />
      )}

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute right-0 flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer md:hidden hover:bg-gray-100 mr-5"
        aria-label="Menú de la aplicación"
        aria-expanded={showMenu}
      >
        {!showMenu && <HamburgerMenu />}
        {showMenu && <Close />}
      </button>
    </>
  )
}
