import type { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'

export interface MeetupsFilters {
  startsAt: {
    operator: RelationalOperator
    value: Date
    inverted?: boolean
  }
  endsAt: {
    operator: RelationalOperator
    value: Date
  }
  location: {
    operator: RelationalOperator
    value: string
  }
}
