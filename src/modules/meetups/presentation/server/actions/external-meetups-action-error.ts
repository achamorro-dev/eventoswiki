import { ActionError } from 'astro:actions'
import { ExternalMeetupsGroupNotFound } from '@/meetups/domain/errors/external-meetups-group-not-found.error'
import { ExternalMeetupsRateLimited } from '@/meetups/domain/errors/external-meetups-rate-limited.error'
import { OrganizationExternalMeetupsUrlMissing } from '@/meetups/domain/errors/organization-external-meetups-url-missing.error'
import type { ExternalMeetupsSource } from '@/meetups/domain/external-meetups-source'
import { EXTERNAL_MEETUPS_SOURCE_LABELS } from '../../external-meetups-source-labels'

export function toExternalMeetupsActionError(
  error: unknown,
  source: ExternalMeetupsSource,
  fallbackMessage: string,
): ActionError {
  const { name, group } = EXTERNAL_MEETUPS_SOURCE_LABELS[source]

  switch (true) {
    case error instanceof OrganizationExternalMeetupsUrlMissing:
      return new ActionError({
        code: 'BAD_REQUEST',
        message: `La organización no tiene configurada la URL de su ${group}`,
      })
    case error instanceof ExternalMeetupsGroupNotFound:
      return new ActionError({
        code: 'BAD_REQUEST',
        message: `No se ha encontrado el ${group}, revisa la URL configurada en la organización`,
      })
    case error instanceof ExternalMeetupsRateLimited:
      return new ActionError({
        code: 'TOO_MANY_REQUESTS',
        message: `${name} está limitando las peticiones, vuelve a intentarlo en unos minutos`,
      })
    default:
      return new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: fallbackMessage })
  }
}
