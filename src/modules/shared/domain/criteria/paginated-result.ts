export class PaginatedResult<T> {
  constructor(
    public data: T[],
    public totalPages: number,
    public page: number,
    public limit: number,
  ) {}
}
