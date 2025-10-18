import { EventType } from '@/modules/shared/domain/types/event-type'
import { Tabs, TabsList, TabsTrigger } from '@/modules/shared/presentation/ui/tabs'
import { navigate } from 'astro:transitions/client'
import { useEffect, useState } from 'react'

interface EventTypeFilterProps {
  value?: EventType
  className?: string
}

export function EventTypeFilter({ value = EventType.EVENTS, className }: EventTypeFilterProps) {
  const [activeTab, setActiveTab] = useState<EventType>(value)

  useEffect(() => {
    // Leer el tipo desde los search params de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const typeFromUrl = urlParams.get('type') as EventType | null

    if (typeFromUrl && Object.values(EventType).includes(typeFromUrl as EventType)) {
      setActiveTab(typeFromUrl as EventType)
    }
  }, [])

  const handleTabChange = (value: string) => {
    const newType = value as EventType
    setActiveTab(newType)

    const url = new URL(window.location.href)
    url.searchParams.set('type', newType)

    navigate(encodeURI(url.toString()))
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={className}>
      <TabsList>
        <TabsTrigger value={EventType.EVENTS}>Eventos</TabsTrigger>
        <TabsTrigger value={EventType.MEETUPS}>Meetups</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
