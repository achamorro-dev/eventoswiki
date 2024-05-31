export interface FindableByIdRepository<Id, Result> {
  find(id: Id): Promise<Result>
}
