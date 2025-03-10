import { ValueObject } from '@/shared/domain/value-object'
import { v4 as uuidv4 } from 'uuid'

export class OrganizationId extends ValueObject<string> {
  static create(): OrganizationId {
    const value = uuidv4()
    return new OrganizationId(value)
  }
}
