import type { Criteria } from '../criteria/criteria'
import type { PaginatedResult } from '../criteria/paginated-result'

export interface MatcheableRepository<C extends Criteria<C['filters'], C['order']>, Value> {
  match(criteria: C): Promise<PaginatedResult<Value>>
}
