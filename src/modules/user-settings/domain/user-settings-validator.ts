import { Validator } from '@/shared/domain/validators/validator'

export interface UserSettingsData {
  meetupAttendanceEmailEnabled: boolean
  organizationUpdatesEmailEnabled: boolean
}

export class UserSettingsValidator extends Validator<UserSettingsData> {
  validate(): string | null {
    if (typeof this.value.meetupAttendanceEmailEnabled !== 'boolean') {
      return 'meetupAttendanceEmailEnabled debe ser un valor booleano'
    }

    if (typeof this.value.organizationUpdatesEmailEnabled !== 'boolean') {
      return 'organizationUpdatesEmailEnabled debe ser un valor booleano'
    }

    return null
  }
}
