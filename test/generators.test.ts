import 'kequtest';
import assert from 'assert';
import {
    randFloat,
    randInt,
    randString,
    randParagraph,
    randWord,
    randDate,
    randBoolean
} from '../src/generators';
import { CHAR_LIST, WORD_LIST } from '../src/util/data';

describe('randFloat', () => {
    it('generates a number', () => {
        assert.strictEqual(typeof randFloat()(), 'number');
    });

    it('generates an absolute number', () => {
        assert.strictEqual(randFloat({ min: 5, max: 5 })(), 5);
    });

    it('generates a number between', () => {
        const num = randFloat({ min: 4, max: 5 })();
        assert.ok(num >= 4);
        assert.ok(num <= 5);
    });

    it('recovers from impossible setting', () => {
        assert.strictEqual(randFloat({ min: 5, max: 4 })(), 5);
    });

    it('generates different numbers', () => {
        const _randFloat = randFloat({ min: 0, max: 100000 });
        assert.notStrictEqual(_randFloat(), _randFloat());
    });
});

describe('randInt', () => {
    it('generates a number', () => {
        assert.strictEqual(typeof randInt()(), 'number');
    });

    it('generates an absolute number', () => {
        assert.strictEqual(randInt({ min: 5, max: 5 })(), 5);
    });

    it('generates a number between', () => {
        const num = randInt({ min: 4, max: 5 })();
        assert.ok(num >= 4);
        assert.ok(num <= 5);
    });

    it('recovers from impossible setting', () => {
        assert.strictEqual(randInt({ min: 5, max: 4 })(), 5);
    });

    it('generates different numbers', () => {
        const _randInt = randInt({ min: 0, max: 100000 });
        assert.notStrictEqual(_randInt(), _randInt());
    });
});

describe('randString', () => {
    it('generates a string', () => {
        assert.strictEqual(typeof randString()(), 'string');
    });

    it('generates a string of a certain length', () => {
        assert.strictEqual(randString({ length: 20 })().length, 20);
    });

    it('generates a string containing only lowercase', () => {
        const str = randString({ charset: 'l' })();
        const chars = CHAR_LIST['l'];
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing only uppercase', () => {
        const str = randString({ charset: 'u' })();
        const chars = CHAR_LIST['u'];
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing only numbers', () => {
        const str = randString({ charset: 'n' })();
        const chars = CHAR_LIST['n'];
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing only special', () => {
        const str = randString({ charset: 's' })();
        const chars = CHAR_LIST['s'];
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing numbers or uppercase', () => {
        const str = randString({ charset: 'nu' })();
        const chars = CHAR_LIST['n'] + CHAR_LIST['u'];
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing only specified chars', () => {
        const str = randString({ charset: '', chars: 'abcdefGHIJK' })();
        const chars = 'abcdefGHIJK';
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string containing numbers or specified chars', () => {
        const str = randString({ charset: 'n', chars: 'abcdefGHIJK' })();
        const chars = CHAR_LIST['n'] + 'abcdefGHIJK';
        assert.ok(str.split('').every(char => chars.includes(char)));
    });

    it('generates a string with prefix and postfix', () => {
        const str = randString({ prefix: 'start-', postfix: '-end' })();
        assert.ok(str.startsWith('start-'));
        assert.ok(str.endsWith('-end'));
    });
});

describe('randWord', () => {
    it('generates a word', () => {
        const str = randWord()();
        assert.strictEqual(typeof str, 'string');
        assert.ok(WORD_LIST.includes(str));
    });

    it('capitalizes a word', () => {
        const str = randWord({ capitalize: true })();
        assert.ok(str[0].toUpperCase() === str[0]);
        assert.ok(str[1].toLowerCase() === str[1]);
    });

    it('uppercases a word', () => {
        const str = randWord({ uppercase: true })();
        assert.ok(str[0].toUpperCase() === str[0]);
        assert.ok(str[1].toUpperCase() === str[1]);
    });

    it('generates multiple words', () => {
        const str = randWord({ multiply: 3, separator: '---' })();
        const words = str.split('---');
        assert.ok(words.every(word => WORD_LIST.includes(word)));
    });
});

describe('randParagraph', () => {
    it('generates a paragraph', () => {
        const str = randParagraph()();
        assert.strictEqual(typeof str, 'string');
        assert.ok(str[0].toUpperCase() === str[0]);
        assert.ok(str[1].toLowerCase() === str[1]);
        assert.ok(str.includes(' '));
        assert.ok(str.indexOf('.') !== str.lastIndexOf('.'));
        assert.strictEqual(str[str.length - 1], '.');
    });

    it('generates a paragraph with a given length', () => {
        const str = randParagraph({ sentencesMin: 2, sentencesMax: 3 })();
        const count = str.split('.').filter(sentence => sentence.length > 0).length;
        assert.ok(count >= 2);
        assert.ok(count <= 3);
    });

    it('generates sentences with a given length', () => {
        const str = randParagraph({ sentencesMin: 1, sentencesMax: 1, wordsMin: 2, wordsMax: 3 })();
        const count = str.split(' ').length;
        assert.ok(count >= 2);
        assert.ok(count <= 3);
    });

    it('generates multiple paragraphs', () => {
        const str = randParagraph({ multiply: 3, separator: '---' })();
        const count = str.split('---').length;
        assert.strictEqual(count, 3);
    });
});

describe('randDate', () => {
    it('generates a date', () => {
        assert.ok(randDate()() instanceof Date);
    });

    it('date is in the past', () => {
        assert.ok(randDate()() <= new Date());
    });

    it('generates a date between the given numbers', () => {
        const now = Date.now();
        const timeAgo = 900000; // 15 minutes
        const fromNow = 900000; // 15 minutes
        const date = randDate({ timeAgo, fromNow })();
        assert.ok(date.getTime() >= now - timeAgo);
        assert.ok(date.getTime() <= now + fromNow);
    });

    it('generates an exact date', () => {
        const now = Date.now();
        const timeAgo = 900000; // 15 minutes
        const fromNow = -900000; // 15 minutes
        const date = randDate({ timeAgo, fromNow })();
        assert.strictEqual(date.getTime(), now - timeAgo);
    });
});

describe('randBoolean', () => {
    it('generates a boolean', () => {
        assert.strictEqual(typeof randBoolean()(), 'boolean');
    });
});
