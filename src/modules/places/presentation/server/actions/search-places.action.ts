import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { SearchPlacesQuery } from '@/modules/places/application/search-places.query'
import { PlacesContainer } from '@/modules/places/di/places.container'
import type { Place } from '@/modules/places/domain/place'

export const searchPlacesAction = defineAction({
  accept: 'json',
  input: z.object({
    query: z.string().min(1, 'La búsqueda no puede estar vacía'),
  }),
  handler: async ({ query }) => {
    try {
      const searchPlacesQuery = PlacesContainer.get(SearchPlacesQuery)
      const places = await searchPlacesQuery.execute(query)
      return places.map((place: Place) => place.toPrimitives())
    } catch (error) {
      if (error instanceof ActionError) {
        throw error
      }

      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Error al realizar la búsqueda de lugares',
      })
    }
  },
})
