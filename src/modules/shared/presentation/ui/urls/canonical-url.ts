const SITE_URL = 'https://eventos.wiki'

/**
 * Parámetros que cambian el contenido de la página y por tanto forman parte de
 * su identidad. El resto (utm_*, referrers…) se descarta para que no genere
 * variantes duplicadas del mismo listado.
 */
const CONTENT_PARAMS = ['province', 'page']

/**
 * URL canónica autorreferente de una página. Se mantiene `page` a propósito:
 * Google pide que las páginas paginadas se apunten a sí mismas, no a la primera.
 */
export function canonicalUrl(url: URL): string {
  const params = new URLSearchParams()

  for (const param of CONTENT_PARAMS) {
    const value = url.searchParams.get(param)
    if (value) params.set(param, value)
  }

  const query = params.toString()

  return `${SITE_URL}${url.pathname}${query ? `?${query}` : ''}`
}
