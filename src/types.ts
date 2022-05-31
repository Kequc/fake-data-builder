export type TGenValue = () => TValue;
export type TValue = number | string | boolean | Date | TData | TGenValue | null | undefined | TValue[];
export type TData = { [key: string]: TValue };

export type TGen<T> = T | (() => T);

export type TBuild<T> = {
    [K in keyof T]: T[K] extends object ? TGen<TBuild<T[K]>> : TGen<T[K]>;
};
export type TOverride<T> = {
    [K in keyof T]?: T[K] extends object ? TGen<TOverride<T[K]>> : TGen<T[K]>;
};
