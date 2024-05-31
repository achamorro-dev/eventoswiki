export interface Criteria<Filters, Order, Offset = number> {
  filters?: Filters
  order?: Order
  limit?: number
  offset?: Offset
}
