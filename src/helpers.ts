import { TGenerator, TValue } from './types';
import { parseValue } from './util';

let _sequence = 0;

export function sequence (generator?: (i: number) => TValue): TGenerator {
    return function () {
        _sequence++;
        if (typeof generator === 'function') return parseValue(generator(_sequence));
        return _sequence;
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
