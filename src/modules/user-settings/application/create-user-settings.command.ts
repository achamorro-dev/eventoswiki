import { UserSettings } from '../domain/user-settings'
import type { UserSettingsRepository } from '../domain/user-settings.repository'

interface CreateUserSettingsRequest {
  userId: string
}

export class CreateUserSettingsCommand {
  constructor(private readonly userSettingsRepository: UserSettingsRepository) {}

  async execute(param: CreateUserSettingsRequest): Promise<void> {
    const { userId } = param

    const userSettings = UserSettings.fromPrimitives({
      id: userId,
      userId,
      meetupAttendanceEmailEnabled: true,
      organizationUpdatesEmailEnabled: true,
    })

    return this.userSettingsRepository.save(userSettings)
  }
}
