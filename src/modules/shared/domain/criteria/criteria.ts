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

  withCount(count: number): Criteria<Filters, Order> {
    this.limit = count
    return this
  }

  andPage(page: number): Criteria<Filters, Order> {
    this.page = page
    return this
  }
}
