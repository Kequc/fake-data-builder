import { TData, TValue } from './types';

export function parseValue (value: TValue): TValue {
    if (typeof value === 'function') return parseValue(value());
    if (isStatic(value)) return value;
    if (Array.isArray(value)) return value.map(parseValue);

    return parseData(value as TData);
}

export function parseData (data: TData): TData {
    const result: TData = {};

    for (const key of Object.keys(data)) {
        result[key] = parseValue(data[key]);
    }

    return result;
}

export function deepAssign (target: TData, source: TData): TData {
    for (const key of Object.keys(source)) {
        const value = source[key];

        if (typeof value === 'function') {
            // function
            target[key] = value();
        } else if (isStatic(value)) {
            // simple replacement
            target[key] = value;
        } else if (Array.isArray(value)) {
            // array
            target[key] = value.map(parseValue);
        } else if (!isStatic(target[key])) {
            // nested
            deepAssign(target[key] as TData, parseData(value as TData));
        } else {
            // set
            target[key] = parseData(value as TData);
        }
    }

    return target;
}

export function isStatic (value: TValue): boolean {
    if (!value) return true;
    if (typeof value !== 'object') return true;
    if (value instanceof Date) return true;

    return false;
}
