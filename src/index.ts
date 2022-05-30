export * from './helpers';

import { TData } from './types';
import { deepAssign, isStatic, parseValue } from './util';

export function build<T> (data: TData) {
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
