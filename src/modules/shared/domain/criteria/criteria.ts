import type { Filter } from './filter'
import { FilterType } from './filter-type'

export abstract class Criteria<Filters, Order> {
  filters: Array<Filter<Filters>>

  protected constructor(
    public order?: Order,
    public limit: number = 9,
    public page: number = 1,
  ) {
    this.filters = []
    this.order = order
    this.limit = limit
    this.page = page
  }

  and(filters: Filters | Array<Filter<Filters>>) {
    this.filters.push({ type: FilterType.AND, filters: filters })
    return this
  }

  or(filters: Filters | Array<Filter<Filters>>) {
    this.filters.push({ type: FilterType.OR, filters: filters })
    return this
  }

  withLimit(limit?: number) {
    if (!limit) return this

    this.limit = limit
    return this
  }

  withPage(page: number) {
    if (page < 1) {
      throw new Error('Page must be greater than 0')
    }

    this.page = page
    return this
  }

  orderBy(order: Order) {
    this.order = order
    return this
  }

  get offset() {
    return (this.page - 1) * this.limit
  }
}
