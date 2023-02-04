import 'kequtest';
import assert from 'assert';
import * as index from '../src/fake-data-builder';

it('exports a lot of stuff', () => {
    assert.strictEqual(typeof index.build, 'function');
    assert.strictEqual(typeof index.randBoolean, 'function');
    assert.strictEqual(typeof index.randDate, 'function');
    assert.strictEqual(typeof index.randString, 'function');
    assert.strictEqual(typeof index.randParagraph, 'function');
    assert.strictEqual(typeof index.randWord, 'function');
    assert.strictEqual(typeof index.randFloat, 'function');
    assert.strictEqual(typeof index.randInt, 'function');
    assert.strictEqual(typeof index.sequence, 'function');
    assert.strictEqual(typeof index.oneOf, 'function');
    assert.strictEqual(typeof index.arrayOf, 'function');
});

describe('build', () => {
    const { build } = index;

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
        const test = builder();
        test.test6.test9;

        assert.deepStrictEqual(builder(), {
            test1: 'hello',
            test2: 2,
            test3: ['happy', 'halloween'],
            test4: 'functional',
            test5: ['aa', 'bb'],
            test6: {
                test7: 'foo',
                test8: ['foo', 'bar'],
                test9: ['cc', 'dd'],
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
            test3: () => ['happy', 'halloween'],
            test4: () => 'functional',
            test5: 'normal',
            test6: {
                test7: () => 'foo',
                test8: () => ['foo', 'bar']
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
