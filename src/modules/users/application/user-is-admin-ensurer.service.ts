import { UserIsNotAdminError } from '../domain/errors/user-is-not-admin.error'
import type { CheckUserIsAdminQuery } from './check-user-is-admin.query'
import type { GetUserQuery } from './get-user.query'

interface Param {
  userId: string
}

export class UserIsAdminEnsurer {
  constructor(
    private readonly getUserQuery: GetUserQuery,
    private readonly checkUserIsAdminQuery: CheckUserIsAdminQuery,
  ) {}

  async ensure(param: Param): Promise<void> {
    const { userId } = param

    const userEntity = await this.getUserQuery.execute({ id: userId })
    const isAdmin = userEntity?.email ? await this.checkUserIsAdminQuery.execute({ email: userEntity.email }) : false

    if (!isAdmin) {
      throw new UserIsNotAdminError(userId)
    }
  }
}
