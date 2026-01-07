export class UserSettingsNotFoundError extends Error {
  constructor(userId: string) {
    super(`User settings not found for user: ${userId}`)
    this.name = 'UserSettingsNotFoundError'
  }
}
