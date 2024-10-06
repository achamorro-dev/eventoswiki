export abstract class Criteria<Filters, Order> {
  protected constructor(
    public filters?: Filters,
    public order?: Order,
    public limit: number = 9,
    public page: number = 1,
  ) {
    this.filters = filters
    this.order = order
    this.limit = limit
    this.page = page
  }

  addFilter(filter: Filters) {
    this.filters = { ...this.filters, ...filter }
    return this
  }

  withCount(count: number) {
    this.limit = count
    return this
  }

  andPage(page: number) {
    this.page = page
    return this
  }
}
