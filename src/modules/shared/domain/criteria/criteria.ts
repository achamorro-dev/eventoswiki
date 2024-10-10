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
    if (page < 1) {
      throw new Error('Page must be greater than 0')
    }

    this.page = page
    return this
  }

  get offset() {
    return (this.page - 1) * this.limit
  }
}
