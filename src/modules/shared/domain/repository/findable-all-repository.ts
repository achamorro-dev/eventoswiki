export interface FindableAllRepository<T> {
  findAll(): Promise<Array<T>>
}
