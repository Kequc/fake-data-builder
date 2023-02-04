type TData = { [key: string]: unknown };
type TReturns<T> = T extends (...args: never) => infer R ? R : T;

export function parseValue (value: unknown): TReturns<unknown> {
    if (typeof value === 'function') return parseValue(value());
    if (Array.isArray(value)) return value.map(parseValue);
    if (isData(value)) return parseData(value);

    return value;
}

type TBuilt<T> = {
    [K in keyof T]: TReturns<T[K]> extends object
        ? TBuilt<TReturns<T[K]>>
        : TReturns<T[K]>;
};

export function parseData (data: TData): TBuilt<TData> {
    const result: TBuilt<TData> = {};

    for (const key of Object.keys(data)) {
        result[key] = parseValue(data[key]);
    }

    return result;
}

export function deepAssign (target: TBuilt<TData>, source: TBuilt<TData>) {
    for (const key of Object.keys(source)) {
        const a = target[key] as TBuilt<TData>;
        const b = source[key] as TBuilt<TData>;

        if (isData(a) && isData(b)) {
            deepAssign(a, b);
        } else {
            target[key] = source[key];
        }
    }
}

export function isData (value: unknown): value is TData {
    // Data object not a Set, Function, null, Date, Array, etc.
    return Object.prototype.toString.call(value) === '[object Object]';
}
