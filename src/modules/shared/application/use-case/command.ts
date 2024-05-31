import { UseCase } from './use-case'

export abstract class Command<Param, Result = void> extends UseCase<Param, Result> {}
