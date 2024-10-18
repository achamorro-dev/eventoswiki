import type { RelationalOperator } from '@/modules/shared/domain/criteria/relational-operator'

export interface FilterCriteria<Value = string | number | Date> {
  operator: RelationalOperator
  value: Value
}
