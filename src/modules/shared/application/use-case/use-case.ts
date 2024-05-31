export abstract class UseCase<Param, Result> {
  abstract execute(param: Param): Promise<Result>
}
