export interface OAuth2Tokens {
  data: object
  tokenType(): string
  accessToken(): string
  accessTokenExpiresInSeconds(): number
  accessTokenExpiresAt(): Date
  hasRefreshToken(): boolean
  refreshToken(): string
  hasScopes(): boolean
  scopes(): string[]
  idToken(): string
}
