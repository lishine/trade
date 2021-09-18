declare module 'promise.any'

type ObjectKeys<T> = T extends Record<string, unknown>
    ? (keyof T)[]
    : T extends number
    ? []
    : T extends Array<any> | string
    ? string[]
    : never

type ObjectEntries<T> = T extends Record<string, unknown> ? [keyof T, T[keyof T]][] : never

type ObjectValues<T> = T extends Record<string, unknown> ? T[keyof T][] : never

interface ObjectConstructor {
    keys<T>(o: T): ObjectKeys<T>
    entries<T>(o: T): ObjectEntries<T>
    values<T>(o: T): ObjectValues<T>
}
