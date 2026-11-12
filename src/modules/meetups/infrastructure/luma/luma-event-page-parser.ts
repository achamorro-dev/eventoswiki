import type { LumaEventPageDataDto, LumaEventPageDto, LumaJsonLdEventDto, LumaNextDataDto } from './luma.dto'

const JSON_LD_SCRIPT_PATTERN = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
const NEXT_DATA_SCRIPT_PATTERN = /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
const JSON_LD_EVENT_TYPE_SUFFIX = 'Event'
const JSON_LD_GRAPH_KEY = '@graph'

export class LumaEventPageParser {
  static parse(html: string): LumaEventPageDto {
    const pageData = LumaEventPageParser.findPageData(html)

    return {
      event: LumaEventPageParser.findJsonLdEvent(html),
      calendarId: pageData?.event?.calendar_api_id ?? null,
      descriptionMirror: pageData?.description_mirror ?? null,
    }
  }

  private static findJsonLdEvent(html: string): LumaJsonLdEventDto | null {
    const nodes = [...html.matchAll(JSON_LD_SCRIPT_PATTERN)].flatMap(([, json]) => toJsonLdNodes(parseJson(json)))

    return nodes.find(isJsonLdEvent) ?? null
  }

  private static findPageData(html: string): LumaEventPageDataDto | null {
    const json = NEXT_DATA_SCRIPT_PATTERN.exec(html)?.[1]
    const nextData = json ? (parseJson(json) as LumaNextDataDto | null) : null

    return nextData?.props?.pageProps?.initialData?.data ?? null
  }
}

function toJsonLdNodes(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value.flatMap(toJsonLdNodes)
  }

  if (isObject(value) && Array.isArray(value[JSON_LD_GRAPH_KEY])) {
    return toJsonLdNodes(value[JSON_LD_GRAPH_KEY])
  }

  return [value]
}

function isJsonLdEvent(node: unknown): node is LumaJsonLdEventDto {
  if (!isObject(node)) {
    return false
  }

  const types = [node['@type']].flat()
  return types.some(type => typeof type === 'string' && type.endsWith(JSON_LD_EVENT_TYPE_SUFFIX))
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseJson(json: string): unknown {
  try {
    return JSON.parse(json)
  } catch (_error) {
    return null
  }
}
