import { parseValue } from './util/parse';

export type TGen<T> = T | (() => T);

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

export function nullable<T> (value: TGen<T>, median = 0.5): () => T | null {
    return function () {
        return Math.random() > median ? null : parseValue(value) as unknown as T;
    };
}
