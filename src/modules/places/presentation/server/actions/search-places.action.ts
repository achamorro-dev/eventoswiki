import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { PlacesLocator } from '@/modules/places/di/places.locator'
import type { Place } from '@/modules/places/domain/place'

export const searchPlacesAction = defineAction({
  input: z.object({
    query: z.string().min(1, 'La búsqueda no puede estar vacía'),
  }),
  handler: async ({ query }) => {
    try {
      const places = await PlacesLocator.searchPlacesQuery.execute(query)
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
