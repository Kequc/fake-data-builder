import { TGenerator, TValue } from './types';
import { parseValue } from './util';

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
