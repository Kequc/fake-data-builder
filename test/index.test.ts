import 'kequtest';
import assert from 'assert';
import { build } from '../src/index';

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
