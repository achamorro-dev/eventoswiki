export const SITE_URL = 'https://eventos.wiki'

/**
 * Identificadores OTE. Cuelgan del UUID y no del slug **a propósito**: la spec
 * exige que `id` no cambie nunca (los consumidores deduplican comparando la
 * cadena exacta) y los slugs son editables desde la aplicación. El espacio
 * `/ote/` deja claro que son identificadores, no páginas navegables; la página
 * canónica viaja aparte en el campo `url`.
 */
export const OteUrls = {
  EVENT_ID: (id: string) => `${SITE_URL}/ote/events/${id}`,
  MEETUP_ID: (id: string) => `${SITE_URL}/ote/meetups/${id}`,
  EVENT: (slug: string) => `${SITE_URL}/events/${slug}`,
  MEETUP: (slug: string) => `${SITE_URL}/meetups/${slug}`,
  ORGANIZATION: (handle: string) => `${SITE_URL}/organizations/${handle}`,
  FEED: `${SITE_URL}/events.json`,
  ORGANIZATION_FEED: (handle: string) => `${SITE_URL}/organizations/${handle}/events.json`,
}
