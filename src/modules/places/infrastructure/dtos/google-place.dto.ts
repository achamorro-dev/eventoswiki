export interface GooglePlaceDto {
  id: string
  displayName: {
    languageCode: string
    text: string
  }
  formattedAddress: string
  location?: {
    latitude: number
    longitude: number
  }
}
