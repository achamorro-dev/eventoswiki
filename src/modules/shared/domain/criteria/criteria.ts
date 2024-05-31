export interface Criteria<Filters, Order> {
  filters?: Filters
  order?: Order
  limit?: number
  offset?: number
}
