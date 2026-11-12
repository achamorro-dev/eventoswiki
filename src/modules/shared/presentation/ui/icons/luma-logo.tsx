import type { IconProps } from './create-icon'

const LUMA_STAR_PATH =
  'M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67'

export function Luma({ size = '1em', width, height, ...props }: IconProps) {
  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 133 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path fill="currentColor" d={LUMA_STAR_PATH} />
    </svg>
  )
}
