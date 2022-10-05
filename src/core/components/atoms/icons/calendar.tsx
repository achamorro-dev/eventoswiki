import type { FC } from 'react'
import type { Icon } from './icon'

export const Calendar: FC<Icon> = (props) => {
  const { size, color } = props
  return (
    <svg
      viewBox='0 0 24 24'
      className='w-6 h-6 stroke-gray-500 dark:stroke-gray-100'
      stroke-width='1.5'
      fill='none'
      stroke-linecap='round'
      stroke-linejoin='round'
      style={{
        width: size,
        height: size,
        stroke: color,
      }}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <rect x='4' y='5' width='16' height='16' rx='2'></rect>
      <line x1='16' y1='3' x2='16' y2='7'></line>
      <line x1='8' y1='3' x2='8' y2='7'></line>
      <line x1='4' y1='11' x2='20' y2='11'></line>
      <line x1='11' y1='15' x2='12' y2='15'></line>
      <line x1='12' y1='15' x2='12' y2='18'></line>
    </svg>
  )
}
