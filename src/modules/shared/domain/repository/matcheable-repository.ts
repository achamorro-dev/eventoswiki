import type { Criteria } from '../criteria/criteria'
import type { PaginatedResult } from '../criteria/paginated-result'

export interface MatcheableRepository<F, O, C extends Criteria<F, O>, Value> {
  match(criteria: C): Promise<PaginatedResult<Value>>
}
