import { TValue, TData, TOverride, TBuild, TGenValue, TGen } from './types';

export function build<T = TData> (data: TBuild<T>) {
    if (!isData(data)) {
        throw new Error('Builder must be an object');
    }

    return function (override?: TOverride<T>): T {
        const result = parseData(data);

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

export function oneOf<T = TValue> (...values: TGen<T>[]): () => T {
    return function () {
        return parseValue(values[Math.floor(Math.random() * values.length)]) as unknown as T;
    };
}

export function arrayOf<T = TValue> (value: TGen<T>, count = 1): () => T[] {
    return function () {
        const result: T[] = [];

        for (let i = 0; i < count; i++) {
            result.push(parseValue(value) as unknown as T);
        }

        return result;
    };
}

function parseValue (value: TValue): TValue {
    if (typeof value === 'function') return parseValue(value());
    if (Array.isArray(value)) return value.map(parseValue);
    if (isData(value)) return parseData(value as TData);

    return value;
}

function parseData (data: TData): TData {
    const result: TData = {};

    for (const key of Object.keys(data)) {
        result[key] = parseValue(data[key]);
    }

    return result;
}

function deepAssign (target: TData, source: TData): TData {
    for (const key of Object.keys(source)) {
        if (!isData(source[key]) || !isData(target[key])) {
            target[key] = source[key];
        } else {
            deepAssign(target[key] as TData, source[key] as TData);
        }
    }

    return target;
}

function isData (value: TValue): boolean {
    // Data object not a Set, Function, null, Date, Array, etc.
    return Object.prototype.toString.call(value) === '[object Object]';
}
