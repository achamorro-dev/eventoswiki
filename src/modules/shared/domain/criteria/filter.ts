import { FilterType } from './filter-type'

export class Filter<Filters> {
  constructor(
    readonly type: FilterType,
    readonly filters: Filters | Array<Filter<Filters>>,
  ) {}

  static and<Filters>(filters: Filters | Array<Filter<Filters>>) {
    return new Filter(FilterType.AND, filters)
  }

  static or<Filters>(filters: Filters | Array<Filter<Filters>>) {
    return new Filter(FilterType.OR, filters)
  }
}
