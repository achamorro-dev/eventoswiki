import type { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'

export interface EventsFilters {
  startsAt: {
    operator: RelationalOperator
    value: Date
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
