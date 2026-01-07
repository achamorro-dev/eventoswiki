import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings.repository'
import { UserSettingsId } from '../domain/user-settings-id'

interface UpdateUserSettingsRequest {
  userId: string
  meetupAttendanceEmailEnabled: boolean
  organizationUpdatesEmailEnabled: boolean
}

export class UpdateUserSettingsCommand {
  constructor(private readonly userSettingsRepository: UserSettingsRepository) {}

  async execute(param: UpdateUserSettingsRequest): Promise<void> {
    const { userId, meetupAttendanceEmailEnabled, organizationUpdatesEmailEnabled } = param

    try {
      const userSettings = await this.userSettingsRepository.find(UserSettingsId.of(userId))

      userSettings.updateSettings({
        meetupAttendanceEmailEnabled,
        organizationUpdatesEmailEnabled,
      })

      return this.userSettingsRepository.save(userSettings)
    } catch {
      const newUserSettings = UserSettings.fromPrimitives({
        id: userId,
        userId,
        meetupAttendanceEmailEnabled,
        organizationUpdatesEmailEnabled,
      })

      return this.userSettingsRepository.save(newUserSettings)
    }
  }
}
