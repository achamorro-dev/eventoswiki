import { Query } from '@/shared/application/use-case/query'
import type { CheckUserIsAdminQuery } from './check-user-is-admin.query'
import type { GetUserQuery } from './get-user.query'

interface CheckUserIsAdminByIdRequest {
  userId: string
}

export class CheckUserIsAdminByIdQuery extends Query<boolean, CheckUserIsAdminByIdRequest> {
  constructor(
    private readonly getUserQuery: GetUserQuery,
    private readonly checkUserIsAdminQuery: CheckUserIsAdminQuery,
  ) {
    super()
  }

  async execute(param: CheckUserIsAdminByIdRequest): Promise<boolean> {
    const user = await this.getUserQuery.execute({ id: param.userId }).catch(() => undefined)

    if (!user?.email) return false

    return this.checkUserIsAdminQuery.execute({ email: user.email })
  }
}
