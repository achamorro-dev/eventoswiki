import { type ComponentType, createElement, type RefAttributes, type SVGProps } from 'react'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string
}

type BaseIcon = ComponentType<Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>>

/**
 * Iconoir renders at 1.5em and ignores `size`; the icons this set replaced
 * rendered at 1em and honoured it. Wrapping keeps both contracts intact so the
 * call sites don't have to care which set is underneath.
 */
export function createIcon(Base: BaseIcon) {
  return function Icon({ size = '1em', width, height, ...props }: IconProps) {
    return createElement(Base, { width: width ?? size, height: height ?? size, ...props })
  }
}
