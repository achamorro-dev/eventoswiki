import type { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'

export interface MeetupsFilters {
  startsAt: {
    operator: RelationalOperator
    value: Date
  }
  endsAt: {
    operator: RelationalOperator
    value: Date
  }
}
