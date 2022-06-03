export type TGen<T> = T | (() => T);
export type TValue = number | string | boolean | Date | TData | (() => TValue) | null | undefined | TValue[];
export type TData = { [key: string]: TValue };

type TBuilder<T> = T extends object ? TGen<{
    [K in keyof T]: TBuilder<T[K]>;
}> : TGen<T>;
type TOverride<T> = T extends object ? TGen<{
    [K in keyof T]?: TOverride<T[K]>;
}> : TGen<T>;

export type TBuilderData<T> = {
    [K in keyof T]: TBuilder<T[K]>;
};
export type TOverrideData<T> = {
    [K in keyof T]?: TOverride<T[K]>;
};
