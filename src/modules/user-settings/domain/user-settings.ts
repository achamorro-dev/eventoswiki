import type { Primitives, Properties } from '@/shared/domain/primitives/primitives'
import { InvalidUserSettingsError } from './errors/invalid-user-settings-error'
import { UserSettingsId } from './user-settings-id'
import { UserSettingsValidator } from './user-settings-validator'

export interface UserSettingsProps {
  id: UserSettingsId
  userId: string
  meetupAttendanceEmailEnabled: boolean
  organizationUpdatesEmailEnabled: boolean
}

export class UserSettings implements UserSettingsProps {
  id: UserSettingsId
  userId: string
  meetupAttendanceEmailEnabled: boolean
  organizationUpdatesEmailEnabled: boolean

  static DEFAULT_SETTINGS = {
    meetupAttendanceEmailEnabled: true,
    organizationUpdatesEmailEnabled: true,
  }

  constructor(settings: Properties<UserSettings>) {
    this.id = settings.id
    this.userId = settings.userId
    this.meetupAttendanceEmailEnabled = settings.meetupAttendanceEmailEnabled
    this.organizationUpdatesEmailEnabled = settings.organizationUpdatesEmailEnabled
  }

  static fromPrimitives(primitives: Primitives<UserSettings>): UserSettings {
    return new UserSettings({
      id: UserSettingsId.of(primitives.id),
      userId: primitives.userId,
      meetupAttendanceEmailEnabled: primitives.meetupAttendanceEmailEnabled,
      organizationUpdatesEmailEnabled: primitives.organizationUpdatesEmailEnabled,
    })
  }

  static default(userId: string): UserSettings {
    return new UserSettings({
      id: UserSettingsId.of(userId),
      userId,
      ...UserSettings.DEFAULT_SETTINGS,
    })
  }

  toPrimitives(): Primitives<UserSettings> {
    return {
      id: this.id.value,
      userId: this.userId,
      meetupAttendanceEmailEnabled: this.meetupAttendanceEmailEnabled,
      organizationUpdatesEmailEnabled: this.organizationUpdatesEmailEnabled,
    }
  }

  getId(): string {
    return this.id.value
  }

  updateSettings(settings: { meetupAttendanceEmailEnabled: boolean; organizationUpdatesEmailEnabled: boolean }) {
    this.ensureIsValidSettings(settings)

    this.meetupAttendanceEmailEnabled = settings.meetupAttendanceEmailEnabled
    this.organizationUpdatesEmailEnabled = settings.organizationUpdatesEmailEnabled
  }

  private ensureIsValidSettings(settings: {
    meetupAttendanceEmailEnabled: boolean
    organizationUpdatesEmailEnabled: boolean
  }) {
    const validator = new UserSettingsValidator(settings)
    const error = validator.validate()

    if (error) throw new InvalidUserSettingsError(error)
  }
}
