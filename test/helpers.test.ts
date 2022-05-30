import 'kequtest';
import assert from 'assert';
import { sequence, oneOf, arrayOf } from '../src/index';

describe('sequence', () => {
    it('returns a number in sequence', () => {
        const sequencer = sequence();
        const start = sequencer() as number;

        assert.strictEqual(start + 1, sequencer() as number);
        assert.strictEqual(start + 2, sequencer() as number);
        assert.strictEqual(start + 3, sequencer() as number);
        assert.strictEqual(start + 4, sequencer() as number);
        assert.strictEqual(start + 5, sequencer() as number);
    });

    it('generates a value from a generator', () => {
        const sequencer = sequence((i) => `hello-${i}`);
        const value = sequencer() as string;
        const start = parseInt(value.split('-').pop(), 10);

        assert.strictEqual(`hello-${start + 1}`, sequencer() as string);
        assert.strictEqual(`hello-${start + 2}`, sequencer() as string);
        assert.strictEqual(`hello-${start + 3}`, sequencer() as string);
        assert.strictEqual(`hello-${start + 4}`, sequencer() as string);
        assert.strictEqual(`hello-${start + 5}`, sequencer() as string);
    });

    it('parses the result', () => {
        const sequencer = sequence((i) => () => `hello-${i}`);
        const value = sequencer() as string;
        const start = parseInt(value.split('-').pop(), 10);

        assert.strictEqual(`hello-${start + 1}`, sequencer() as string);
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