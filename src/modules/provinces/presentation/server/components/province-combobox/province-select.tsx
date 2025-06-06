import type { Province } from '@/provinces/domain/province'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { navigate } from 'astro:transitions/client'
import type { FC } from 'react'

interface Props {
  id?: string
  placeholder?: string
  value?: string
  provinces: Province[]
  className?: string
  size?: 'sm' | 'default'
  onChange?: (value: string) => void
}

export const ProvinceSelect: FC<Props> = props => {
  const { id, placeholder, value, provinces, className, size = 'default', onChange } = props

  const handleChange = (value: string) => {
    if (!onChange) {
      const href = value === 'empty' ? '?' : `?province=${value}`
      navigate(href, { history: 'replace' })
      return
    }

    onChange(value === 'empty' ? '' : value)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger id={id} size={size} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'empty'} key="clear">
          &nbsp;
        </SelectItem>
        {provinces.map(province => (
          <SelectItem value={province.slug} key={province.slug}>
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
