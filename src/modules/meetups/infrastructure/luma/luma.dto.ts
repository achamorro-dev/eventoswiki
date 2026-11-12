export interface LumaCalendarFeedEventDto {
  uid: string
  summary: string
  startsAt: string
  endsAt: string | null
  description: string | null
  location: string | null
  status: string | null
}

export interface LumaEventPageDto {
  event: LumaJsonLdEventDto | null
  calendarId: string | null
  descriptionMirror: LumaRichTextNodeDto | null
}

export interface LumaJsonLdEventDto {
  '@type': string | string[]
  description?: string
  image?: string | string[]
  eventAttendanceMode?: string
  location?: LumaJsonLdLocationDto | LumaJsonLdLocationDto[]
}

export interface LumaJsonLdLocationDto {
  '@type'?: string
  address?: string | LumaJsonLdPostalAddressDto
}

export interface LumaJsonLdPostalAddressDto {
  streetAddress?: string
  addressLocality?: string
}

export interface LumaNextDataDto {
  props?: {
    pageProps?: {
      initialData?: {
        data?: LumaEventPageDataDto
      }
    }
  }
}

export interface LumaEventPageDataDto {
  event?: { calendar_api_id?: string }
  description_mirror?: LumaRichTextNodeDto | null
}

export interface LumaRichTextNodeDto {
  type: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: LumaRichTextMarkDto[]
  content?: LumaRichTextNodeDto[]
}

export interface LumaRichTextMarkDto {
  type: string
  attrs?: Record<string, unknown>
}
