export type TGen<T> = T | (() => T);
export type TData = { [key: string]: unknown };
export type TReturns<T> = T extends (...args: never) => infer R ? R : T;

export type TBuilder<T> = {
    [K in keyof T]: TGen<T[K] extends object
        ? TBuilder<T[K]>
        : T[K]>;
};
export type TOverride<T> = {
    [K in keyof T]?: TGen<T[K] extends object
        ? TOverride<T[K]>
        : T[K]>;
};
export type TBuilt<T> = {
    [K in keyof T]: TReturns<T[K]> extends object
        ? TBuilt<TReturns<T[K]>>
        : TReturns<T[K]>;
};
