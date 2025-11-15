import { navigate } from 'astro:transitions/client'
import type { FC } from 'react'
import type { Province } from '@/provinces/domain/province'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

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
      // Get current URL and search parameters
      const currentUrl = new URL(window.location.href)
      const searchParams = new URLSearchParams(currentUrl.search)

      // Update or remove the province parameter
      if (value === 'empty') {
        searchParams.delete('province')
      } else {
        searchParams.set('province', value)
      }

      // Build the new URL with updated search parameters
      const newSearch = searchParams.toString()
      const href = newSearch ? `?${newSearch}` : window.location.pathname

      navigate(href)
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
