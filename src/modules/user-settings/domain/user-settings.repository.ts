import type { FindableByIdRepository } from '@/shared/domain/repository/findable-by-id-repository'
import type { SaveableRepository } from '@/shared/domain/repository/saveable-repository'
import type { UserSettings } from '@/user-settings/domain/user-settings'
import { UserSettingsId } from '@/user-settings/domain/user-settings-id'

export type UserSettingsRepository = SaveableRepository<UserSettings> &
  FindableByIdRepository<UserSettingsId, UserSettings>
