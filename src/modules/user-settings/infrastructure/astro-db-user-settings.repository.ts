import { db, eq, UserSettings as UserSettingsTable } from 'astro:db'
import { UserSettings } from '@/user-settings/domain/user-settings'
import type { UserSettingsRepository } from '@/user-settings/domain/user-settings.repository'
import { UserSettingsId } from '@/user-settings/domain/user-settings-id'
import { UserSettingsNotFoundError } from '../domain/errors/user-settings-not-found-error'

export class AstroDbUserSettingsRepository implements UserSettingsRepository {
  async save(settings: UserSettings): Promise<void> {
    const primitives = settings.toPrimitives()

    const existingSettings = await db
      .select()
      .from(UserSettingsTable)
      .where(eq(UserSettingsTable.id, primitives.id))
      .get()

    if (existingSettings) {
      await db
        .update(UserSettingsTable)
        .set({
          meetupAttendanceEmailEnabled: primitives.meetupAttendanceEmailEnabled,
          organizationUpdatesEmailEnabled: primitives.organizationUpdatesEmailEnabled,
          updatedAt: new Date(),
        })
        .where(eq(UserSettingsTable.id, primitives.id))
    } else {
      await db.insert(UserSettingsTable).values({
        id: primitives.id,
        userId: primitives.userId,
        meetupAttendanceEmailEnabled: primitives.meetupAttendanceEmailEnabled,
        organizationUpdatesEmailEnabled: primitives.organizationUpdatesEmailEnabled,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return
  }

  async find(id: UserSettingsId): Promise<UserSettings> {
    const result = await db.select().from(UserSettingsTable).where(eq(UserSettingsTable.id, id.value)).get()

    if (!result) {
      throw new UserSettingsNotFoundError(id.value)
    }

    return UserSettings.fromPrimitives({
      id: result.id,
      userId: result.userId,
      meetupAttendanceEmailEnabled: result.meetupAttendanceEmailEnabled,
      organizationUpdatesEmailEnabled: result.organizationUpdatesEmailEnabled,
    })
  }
}
