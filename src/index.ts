import { TValue, TGenerator, TData } from './types';

export function build<T = TData> (data: TData) {
    if (isStatic(data) || Array.isArray(data)) {
        throw new Error('Builder data must be an object');
    }

    return function (override?: TData): T {
        const result: TData = {};

        for (const key of Object.keys(data)) {
            result[key] = parseValue(data[key]);
        }

        if (override) {
            if (isStatic(override) || Array.isArray(override)) {
                throw new Error('Override must be an object');
            }

            deepAssign(result, override);
        }

        return result as unknown as T;
    };
}

export function sequence (generator?: (i: number) => TValue): TGenerator {
    let count = 0;

    return function () {
        count++;
        if (typeof generator === 'function') return parseValue(generator(count));
        return count;
    };
}

export function oneOf (...values: TValue[]): TGenerator {
    return function () {
        return parseValue(values[Math.floor(Math.random() * values.length)]);
    };
}

export function arrayOf (value: TValue, count = 1): TGenerator {
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
    if (isStatic(value)) return value;
    if (Array.isArray(value)) return value.map(parseValue);

    return parseData(value as TData);
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
        const value = source[key];

        if (typeof value === 'function') {
            // function
            target[key] = parseValue(value());
        } else if (isStatic(value)) {
            // simple replacement
            target[key] = value;
        } else if (Array.isArray(value)) {
            // array
            target[key] = value.map(parseValue);
        } else if (!isStatic(target[key]) && !Array.isArray(target[key])) {
            // nested
            deepAssign(target[key] as TData, parseData(value as TData));
        } else {
            // set
            target[key] = parseData(value as TData);
        }
    }

    return target;
}

function isStatic (value: TValue): boolean {
    if (!value) return true;
    if (typeof value !== 'object') return true;
    if (value instanceof Date) return true;

    return false;
}
