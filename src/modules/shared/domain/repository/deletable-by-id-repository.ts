export interface DeletableByIdRepository<Id, Result = void> {
  delete(id: Id): Promise<Result>
}
