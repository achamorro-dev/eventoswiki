import type { FC } from 'react'
import type { Icon } from './icon'

export const Link: FC<Icon> = (props) => {
  const { size, color } = props
  return (
    <svg
      className='w-6 h-6 stroke-gray-300'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{
        width: size,
        height: size,
        stroke: color,
      }}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5'></path>
      <path d='M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5'></path>
    </svg>
  )
}
