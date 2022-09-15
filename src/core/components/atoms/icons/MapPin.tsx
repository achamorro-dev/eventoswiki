import type { FC } from 'react'

export const MapPin: FC = () => {
  return (
    <svg
      viewBox='0 0 24 24'
      stroke-width='1.5'
      className='w-6 h-6 stroke-gray-500'
      fill='none'
      stroke-linecap='round'
      stroke-linejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <circle cx='12' cy='11' r='3'></circle>
      <path d='M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z'></path>
    </svg>
  )
}
