import { FC, useState } from 'react'
import { Button } from '../../atoms/button/Button'
import { Close } from '../../atoms/icons/Close'
import { HamburgerMenu } from '../../atoms/icons/HamburgerMenu'
import { Link } from '../../atoms/link/Link'
import { Logo } from '../logo/Logo'
import { ThemeModeToggle } from '../theme-mode-toggle/ThemeModeToggle'

export const Menu: FC = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <div
        className={`top-0 left-0 items-start w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 lg:text-base md:bg-transparent md:p-0 md:relative md:flex ${
          showMenu ? 'flex fixed' : 'hidden'
        }`}
      >
        <div className='flex-col w-full h-auto overflow-hidden bg-white rounded-lg md:bg-transparent md:overflow-visible md:rounded-none md:relative md:flex md:flex-row md:justify-end'>
          <Logo className='ml-5 md:hidden' />
          <div className='flex flex-col items-start justify-center w-full space-x-6 mb-4 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:mb-0 md:mr-4 md:flex-row md:items-center md:justify-end '>
            <Link href='/eventos/1'>Eventos</Link>
            <Button variant='text' className='hidden md:block'>
              Añadir evento
            </Button>
          </div>
        </div>
        <ThemeModeToggle className='hidden md:flex' />
      </div>

      {showMenu && <ThemeModeToggle className='relative right-5 md:hidden' />}

      <div
        onClick={() => setShowMenu(!showMenu)}
        className='absolute right-0 flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer md:hidden hover:bg-gray-100 mr-5'
      >
        {!showMenu && <HamburgerMenu />}
        {showMenu && <Close />}
      </div>
    </>
  )
}
