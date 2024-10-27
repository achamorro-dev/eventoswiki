export interface FindableByIdOrNullRepository<Id, Result> {
  find(id: Id): Promise<Result | null>
}
