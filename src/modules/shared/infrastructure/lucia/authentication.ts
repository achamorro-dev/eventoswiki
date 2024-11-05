import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db, Session, User } from 'astro:db'
import { Lucia } from 'lucia'

//FIXME: review typings when the adapter fix is released
//@ts-expect-error
const adapter = new DrizzleSQLiteAdapter(db, Session, User)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'auth_session',
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
})
