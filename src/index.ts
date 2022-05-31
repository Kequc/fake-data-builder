import { TValue, TData, TOverride, TBuild, TGenValue } from './types';

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

export function sequence (generator?: (i: number) => TValue): TGenValue {
    let count = 0;

    return function () {
        count++;
        if (typeof generator === 'function') return parseValue(generator(count));
        return count;
    };
}

export function oneOf (...values: TValue[]): TGenValue {
    return function () {
        return parseValue(values[Math.floor(Math.random() * values.length)]);
    };
}

export function arrayOf (value: TValue, count = 1): TGenValue {
    return function () {
        const result: TValue = [];

        for (let i = 0; i < count; i++) {
            result.push(parseValue(value));
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
