import { TData, TOverride, TBuilder, TGen, TBuilt, TReturns } from './types';
export * from './rand';

export function build<T> (builder: TBuilder<T>) {
    if (!isData(builder)) {
        throw new Error('Builder must be an object');
    }

    return function (override?: TOverride<T>): T {
        const result = parseData(builder);

        if (override) {
            if (!isData(override)) {
                throw new Error('Override must be an object');
            }

            deepAssign(result, parseData(override));
        }

        return result as unknown as T;
    };
}

export function sequence<T = number> (generator?: (i: number) => TGen<T>): () => T {
    let count = 0;
    const isFunction = typeof generator === 'function';

    return function () {
        count++;
        return (isFunction ? parseValue(generator(count)) : count) as unknown as T;
    };
}

export function oneOf<T> (...values: TGen<T>[]): () => T {
    return function () {
        return parseValue(values[Math.floor(Math.random() * values.length)]) as unknown as T;
    };
}

export function arrayOf<T> (value: TGen<T>, count = 1): () => T[] {
    return function () {
        const result: T[] = [];

        for (let i = 0; i < count; i++) {
            result.push(parseValue(value) as unknown as T);
        }

        return result;
    };
}

function parseValue (value: unknown): TReturns<unknown> {
    if (typeof value === 'function') return parseValue(value());
    if (Array.isArray(value)) return value.map(parseValue);
    if (isData(value)) return parseData(value);

    return value;
}

function parseData (data: TData): TBuilt<TData> {
    const result: TBuilt<TData> = {};

    for (const key of Object.keys(data)) {
        result[key] = parseValue(data[key]);
    }

    return result;
}

function deepAssign (target: TBuilt<TData>, source: TBuilt<TData>) {
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

function isData (value: unknown): value is TData {
    // Data object not a Set, Function, null, Date, Array, etc.
    return Object.prototype.toString.call(value) === '[object Object]';
}
