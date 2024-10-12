import { FilterType } from './filter-type'

export abstract class Criteria<Filters, Order> {
  filters: Array<{ type: FilterType; filters: Filters }>

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

  and(filter: Filters) {
    this.filters.push({ type: FilterType.AND, filters: filter })
    return this
  }

  or(filter: Filters) {
    this.filters.push({ type: FilterType.OR, filters: filter })
    return this
  }

  withCount(count: number) {
    this.limit = count
    return this
  }

  andPage(page: number) {
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
