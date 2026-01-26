import { Query } from '@/shared/application/use-case/query'
import type { UsersRepository } from '../domain/users.repository'

// Since Query expects an object usually, or generic Request.
// Base Query type usually takes (Response, Request).
// Let's assume input can be string or object. The previous example used object.
// But check-user-is-admin.ts had execute(email: string).
// I should align with base classes. Usually Request is an object.

interface CheckUserIsAdminRequest {
  email: string
}

export class CheckUserIsAdminQuery extends Query<boolean, CheckUserIsAdminRequest> {
  constructor(private readonly usersRepository: UsersRepository) {
    super()
  }

  async execute(input: CheckUserIsAdminRequest): Promise<boolean> {
    return this.usersRepository.isAdmin(input.email) // Need to adjust execute signature in base if it enforces object
  }
}
