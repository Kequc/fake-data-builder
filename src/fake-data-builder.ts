import { TGen } from './helpers';
import { deepAssign, isData, parseData } from './util/parse';

export * from './generators';
export * from './helpers';

type TBuilder<T> = {
    [K in keyof T]: TGen<T[K] extends object
        ? TBuilder<T[K]>
        : T[K]>;
};
type TOverride<T> = {
    [K in keyof T]?: TGen<T[K] extends object
        ? TOverride<T[K]>
        : T[K]>;
};

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
