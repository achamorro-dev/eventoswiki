export class InvalidUserSettingsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidUserSettingsError'
  }
}
