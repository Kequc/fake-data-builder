import { CHAR_LIST, WORD_LIST, YEAR_MS } from './util/data';

type TBooleanOptions = {
    median?: number;
};

export function randBoolean (opt?: TBooleanOptions): () => boolean {
    const median = check<number>(0.5, opt?.median);
    return () => Math.random() < median;
}

type TDateOptions = {
    timeAgo?: number;
    fromNow?: number;
};

export function randDate (opt?: TDateOptions): () => Date {
    const now = Date.now();
    const min = now - check<number>(YEAR_MS * 2, opt?.timeAgo);
    const max = now + check<number>(0, opt?.fromNow);
    return () => new Date(min + Math.random() * (max - min));
}

type TStringOptions = {
    charset?: string;
    chars?: string;
    length?: number;
    prefix?: string;
    postfix?: string;
    multiply?: number;
    separator?: string;
};

export function randString (opt?: TStringOptions): () => string {
    const charset = check<string>('ln', opt?.charset);
    const chars = charset.split('').map(c => check<string>('', CHAR_LIST[c])).join('') + check<string>('', opt?.chars);
    const length = check<number>(5, opt?.length);
    const prefix = check<string>('', opt?.prefix);
    const postfix = check<string>('', opt?.postfix);
    const multiply = check<number>(1, opt?.multiply);
    const separator = check<string>(' ', opt?.separator);
    function chooseChar () {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    function createString () {
        return prefix + genString(length, chooseChar, '') + postfix;
    }
    return () => genString(multiply, createString, separator);
}

type TParagraphOptions = {
    sentencesMin?: number;
    sentencesMax?: number;
    wordsMin?: number;
    wordsMax?: number;
    multiply?: number;
    separator?: string;
};

export function randParagraph (opt?: TParagraphOptions): () => string {
    const numSentences = randInt(minMax(5, 20, opt?.sentencesMin, opt?.sentencesMax));
    const numWords = randInt(minMax(5, 20, opt?.wordsMin, opt?.wordsMax));
    const multiply = check<number>(1, opt?.multiply);
    const separator = check<string>('\n\n', opt?.separator);
    function createSentence () {
        return capital(genString(numWords(), chooseWord, ' ') + '.');
    }
    function createParagraph () {
        return genString(numSentences(), createSentence, ' ');
    }
    return () => genString(multiply, createParagraph, separator);
}


type TWordOptions = {
    uppercase?: boolean;
    capitalize?: boolean;
    prefix?: string;
    postfix?: string;
    multiply?: number;
    separator?: string;
};

export function randWord (opt?: TWordOptions): () => string {
    const uppercase = check<boolean>(false, opt?.uppercase);
    const capitalize = check<boolean>(false, opt?.capitalize);
    const prefix = check<string>('', opt?.prefix);
    const postfix = check<string>('', opt?.postfix);
    const multiply = check<number>(1, opt?.multiply);
    const separator = check<string>(' ', opt?.separator);
    function createWord () {
        let word = chooseWord();
        if (uppercase) word = word.toUpperCase();
        if (capitalize) word = capital(word);
        return prefix + word + postfix;
    }
    return () => genString(multiply, createWord, separator);
}

type TFloatOptions = {
    min?: number;
    max?: number;
};

export function randFloat (opt?: TFloatOptions): () => number {
    const { min, max } = minMax(0, 1, opt?.min, opt?.max);
    return () => (Math.random() * (max - min)) + min;
}

type TIntOptions = {
    min?: number;
    max?: number;
};

export function randInt (opt?: TIntOptions): () => number {
    const { min, max } = minMax(1, 10, opt?.min, opt?.max);
    return () => Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function chooseWord () {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function capital (word: string): string {
    return word[0].toUpperCase() + word.slice(1);
}

function minMax (min: number, max: number, newMin?: number, newMax?: number): { min: number, max: number } {
    if (typeof newMax === 'number') max = newMax;
    if (typeof newMin === 'number') min = newMin;
    if (max < min) max = min;
    return { min, max };
}

function check<T> (def: T, value?: unknown): T {
    return (typeof def === typeof value) ? value as T : def;
}

function genString (length: number, callback: () => string, separator: string): string {
    return Array(length).fill(undefined).map(callback).join(separator);
}
