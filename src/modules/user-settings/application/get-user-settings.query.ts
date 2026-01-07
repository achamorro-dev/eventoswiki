import { UserSettingsNotFoundError } from '../domain/errors/user-settings-not-found-error'
import type { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings.repository'
import { UserSettingsId } from '../domain/user-settings-id'

interface GetUserSettingsRequest {
  userId: string
}

export class GetUserSettingsQuery {
  constructor(private readonly userSettingsRepository: UserSettingsRepository) {}

  async execute(param: GetUserSettingsRequest): Promise<UserSettings> {
    const userSettingsId = UserSettingsId.of(param.userId)

    try {
      return await this.userSettingsRepository.find(userSettingsId)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new UserSettingsNotFoundError(param.userId)
      }
      throw error
    }
  }
}
