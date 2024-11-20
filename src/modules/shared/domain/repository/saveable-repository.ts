export interface SaveableRepository<Value, Result = void> {
  save(value: Value): Promise<Result>
}
