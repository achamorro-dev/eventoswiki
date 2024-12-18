/**
 * Review and give an start https://github.com/CodelyTV/typescript-primitives-type
 *
 * We work with Date as a string to allow serialization and deserialization
 */

import type { ValueObject } from '../value-object'

/* eslint-disable @typescript-eslint/ban-types */
type Methods<T> = {
  [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

type MethodsAndProperties<T> = { [key in keyof T]: T[key] }

export type Properties<T> = Omit<MethodsAndProperties<T>, Methods<T>>

type PrimitiveTypes = string | number | boolean | undefined | null

type ValueObjectValue<T> = T extends PrimitiveTypes
  ? T
  : T extends Date
    ? string
    : T extends URL
      ? string
      : T extends ValueObject<infer U>
        ? ValueObjectValue<U>
        : T extends { value: infer U }
          ? U
          : T extends Array<{ value: infer U }>
            ? U[]
            : T extends Array<infer U>
              ? Array<ValueObjectValue<U>>
              : T extends { [K in keyof Properties<T>]: unknown }
                ? { [K in keyof Properties<T>]: ValueObjectValue<Properties<T>[K]> }
                : T extends ValueObject<infer U>
                  ? Primitives<U>
                  : T extends unknown
                    ? T
                    : never

export type Primitives<T> = {
  [key in keyof Properties<T>]: ValueObjectValue<T[key]>
}
