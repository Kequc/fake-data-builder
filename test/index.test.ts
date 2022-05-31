import 'kequtest';
import assert from 'assert';
import { build, sequence, oneOf, arrayOf } from '../src/index';

describe('build', () => {
    it('builds data', () => {
        const builder = build({
            test1: 'hello',
            test2: 2,
            test3: ['happy', 'halloween'],
            test4: () => 'functional',
            test5: [() => 'aa', () => 'bb'],
            test6: {
                test7: 'foo',
                test8: ['foo', 'bar'],
                test9: [() => 'cc', () => 'dd']
            }
        });

        assert.deepStrictEqual(builder(), {
            test1: 'hello',
            test2: 2,
            test3: ['happy', 'halloween'],
            test4: 'functional',
            test5: ['aa', 'bb'],
            test6: {
                test7: 'foo',
                test8: ['foo', 'bar'],
                test9: ['cc', 'dd']
            }
        });
    });

    it('throws error with invalid data', () => {
        assert.throws(() => build(null as any));
        assert.throws(() => build((() => 'hi') as any));
        assert.throws(() => build(undefined as any));
        assert.throws(() => build([{ hello: 'there' }] as any));
        assert.throws(() => build(1 as any));
    });

    it('override', () => {
        const builder = build({
            test1: 'hello',
            test2: 2,
            test3: ['happy', 'halloween'],
            test4: () => 'functional',
            test5: 'normal',
            test6: {
                test7: 'foo',
                test8: ['foo', 'bar']
            }
        });

        assert.deepStrictEqual(builder({
            test1: 'something',
            test2: 55,
            test3: [() => 'nothing'],
            test4: () => 'other value',
            test6: {
                test7: 'harry potter'
            },
            // @ts-ignore
            test9: 'over here'
        }), {
            test1: 'something',
            test2: 55,
            test3: ['nothing'],
            test4: 'other value',
            test5: 'normal',
            test6: {
                test7: 'harry potter',
                test8: ['foo', 'bar']
            },
            test9: 'over here'
        });
    });

    it('throws error with invalid override', () => {
        const builder = build({ test1: 'hello' });

        assert.throws(() => builder((() => 'hi') as any));
        assert.throws(() => builder([{ hello: 'there' }] as any));
        assert.throws(() => builder(1 as any));
    });

    it('supports nested builders', () => {
        const buildera = build({ test3: () => 'there' });
        const builderb = build({ test1: 'hello', test2: () => buildera() });

        assert.deepStrictEqual(builderb(), {
            test1: 'hello',
            test2: {
                test3: 'there'
            }
        });
    });
});

describe('sequence', () => {
    it('returns a number in sequence', () => {
        const sequencer = sequence();

        assert.strictEqual(1, sequencer() as number);
        assert.strictEqual(2, sequencer() as number);
        assert.strictEqual(3, sequencer() as number);
        assert.strictEqual(4, sequencer() as number);
        assert.strictEqual(5, sequencer() as number);
    });

    it('generates a value from a generator', () => {
        const sequencer = sequence((i) => `hello-${i}`);

        assert.strictEqual(`hello-${1}`, sequencer() as string);
        assert.strictEqual(`hello-${2}`, sequencer() as string);
        assert.strictEqual(`hello-${3}`, sequencer() as string);
        assert.strictEqual(`hello-${4}`, sequencer() as string);
        assert.strictEqual(`hello-${5}`, sequencer() as string);
    });

    it('parses the result', () => {
        const sequencer = sequence((i) => () => `hello-${i}`);

        assert.strictEqual(`hello-${1}`, sequencer() as string);
    });
});

describe('oneOf', () => {
    it('returns a random value', () => {
        const values = ['hello', 'there', 'foo', 'bar'];
        const random = oneOf(...values);

        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
    });

    it('returns undefined when empty', () => {
        assert.strictEqual(undefined, oneOf()());
    });

    it('parses the result', () => {
        const values = ['foo', 'bar'];
        const random = oneOf(() => values[0], () => values[1]);

        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
        assert.ok(values.includes(random() as string));
    });
});

describe('arrayOf', () => {
    it('returns an array of something', () => {
        assert.deepStrictEqual(arrayOf('hi', 3)(), ['hi', 'hi', 'hi']);
        assert.deepStrictEqual(arrayOf(true, 2)(), [true, true]);
        assert.deepStrictEqual(arrayOf(11, 4)(), [11, 11, 11, 11]);
    });

    it('parses the result', () => {
        assert.deepStrictEqual(arrayOf(() => 'hey', 5)(), ['hey', 'hey', 'hey', 'hey', 'hey']);
    });
});
