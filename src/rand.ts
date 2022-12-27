import { CHAR_LIST, WORD_LIST, YEAR_MS } from './data';

export function randBoolean (): () => boolean {
    return () => Math.random() < 0.5;
}

type TDateOptions = {
    timeAgo?: number;
    fromNow?: number;
};

export function randDate (opt?: TDateOptions): () => Date {
    const now = Date.now();
    const min = now - (opt?.timeAgo ?? (YEAR_MS * 2));
    const max = now + (opt?.fromNow ?? 0);
    return () => new Date(min + Math.random() * (max - min));
}

type TStringOptions = {
    charset?: string;
    chars?: string;
    length?: number;
    prefix?: string;
    postfix?: string;
};

export function randString (opt?: TStringOptions): () => string {
    const charset = check<string>('ln', opt?.charset);
    const length = check<number>(5, opt?.length);
    const chars = charset.split('').map(c => check<string>('', CHAR_LIST[c])).join('') + check<string>('', opt?.chars);
    const prefix = check<string>('', opt?.prefix);
    const postfix = check<string>('', opt?.postfix);
    function generateChar () {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return () => prefix + generateArray(length, generateChar).join('') + postfix;
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
    const numWords = randInt(minMax(5, 20, opt?.wordsMin, opt?.wordsMax));
    const numSentences = randInt(minMax(5, 20, opt?.sentencesMin, opt?.sentencesMax));
    const multiply = check<number>(1, opt?.multiply);
    const separator = check<string>('\n\n', opt?.separator);
    function generateSentence () {
        return capitalize(generateArray(numWords(), chooseWord).join(' ') + '.');
    }
    function generateParagraph () {
        return generateArray(numSentences(), generateSentence).join(' ');
    }
    return () => generateArray(multiply, generateParagraph).join(separator);
}

type TWordOptions = {
    capitalize?: boolean;
    uppercase?: boolean;
    multiply?: number;
    separator?: string;
};

export function randWord (opt?: TWordOptions): () => string {
    const multiply = check<number>(1, opt?.multiply);
    const separator = check<string>(' ', opt?.separator);
    function generateWord () {
        const word = chooseWord();
        if (opt?.uppercase) return word.toUpperCase();
        if (opt?.capitalize) return capitalize(word);
        return word;
    }
    return () => generateArray(multiply, generateWord).join(separator);
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

// utils

function chooseWord () {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function capitalize (word: string): string {
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

function generateArray<T> (length: number, containing: () => T): T[] {
    return Array(length).fill(undefined).map(containing);
}
