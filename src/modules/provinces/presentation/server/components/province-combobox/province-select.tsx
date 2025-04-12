import type { Province } from '@/provinces/domain/province'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { navigate } from 'astro:transitions/client'
import type { FC } from 'react'

interface Props {
  id?: string
  placeholder?: string
  value?: string
  provinces: Province[]
}

export const ProvinceSelect: FC<Props> = props => {
  const { id, placeholder, value, provinces } = props

  const onChange = (value: string) => {
    navigate(`?province=${value}`, { history: 'replace' })
  }

  return (
    <Select defaultValue={value} onValueChange={onChange}>
      <SelectTrigger id={id} size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {provinces.map(province => (
          <SelectItem value={province.slug} key={province.slug}>
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
