const DEFAULT_TIMEZONE = 'Europe/Madrid'
const CANARY_TIMEZONE = 'Atlantic/Canary'

/**
 * Provincias canarias, normalizadas. El resto de España es Europe/Madrid.
 * Se aceptan tanto el nombre ("Las Palmas") como el slug ("las-palmas") porque
 * `Event.location` / `Meetup.location` llevan el nombre al leer de base de datos
 * y el slug al escribir.
 */
const CANARY_PROVINCES = new Set(['las palmas', 'santa cruz de tenerife'])

function normalize(province: string): string {
  return province
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Zona horaria IANA de un evento a partir de su provincia.
 * Sin provincia (caso frecuente en los meetups importados de Meetup.com, que
 * nunca reciben una) se asume peninsular.
 */
export function timezoneForProvince(province: string | null | undefined): string {
  if (!province) return DEFAULT_TIMEZONE

  return CANARY_PROVINCES.has(normalize(province)) ? CANARY_TIMEZONE : DEFAULT_TIMEZONE
}
