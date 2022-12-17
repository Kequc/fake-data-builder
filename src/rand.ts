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
};

export function randString (opt?: TStringOptions): () => string {
    let chars = '';
    const charset = typeof opt?.charset === 'string' ? opt.charset : 'ln';
    const length = typeof opt?.length === 'number' ? opt.length : 5;
    if (typeof opt?.chars === 'string') chars += opt.chars;
    for (const c of charset.split('')) {
        chars += CHAR_LIST[c] ?? '';
    }
    const charIndex = randInt({ max: chars.length });
    return () => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(charIndex() - 1);
        }
        return result;
    };
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
    const separator = typeof opt?.separator === 'string' ? opt.separator : '\n\n';
    function generateSentence () {
        return capitalize(randWord({ multiply: numWords() })()) + '.';
    }
    function generateParagraph () {
        return generateArray(numSentences(), generateSentence).join(' ');
    }
    return () => {
        return generateArray(opt?.multiply ?? 1, generateParagraph).join(separator);
    };
}

type TWordOptions = {
    capitalize?: boolean;
    uppercase?: boolean;
    multiply?: number;
    separator?: string;
};

export function randWord (opt?: TWordOptions): () => string {
    const separator = typeof opt?.separator === 'string' ? opt.separator : ' ';
    const wordIndex = randInt({ max: WORD_LIST.length });
    function generateWord () {
        const word = WORD_LIST[wordIndex() - 1];
        if (opt?.uppercase) return word.toUpperCase();
        if (opt?.capitalize) return capitalize(word);
        return word;
    }
    return () => generateArray(opt?.multiply ?? 1, generateWord).join(separator);
}

type TFloatOptions = {
    min?: number;
    max?: number;
};

export function randFloat (opt?: TFloatOptions): () => number {
    const size = minMax(0, 1, opt?.min, opt?.max);
    return () => {
        return (Math.random() * (size.max - size.min)) + size.min;
    };
}

type TIntOptions = {
    min?: number;
    max?: number;
};

export function randInt (opt?: TIntOptions): () => number {
    const size = minMax(1, 10, opt?.min, opt?.max);
    return () => {
        return Math.floor(Math.random() * ((size.max - size.min) + 1)) + size.min;
    };
}

// utils

function capitalize (word: string): string {
    return word[0].toUpperCase() + word.slice(1);
}

function minMax (min: number, max: number, newMin?: number, newMax?: number): { min: number, max: number } {
    if (typeof newMax === 'number' && newMax > 0) max = newMax;
    if (typeof newMin === 'number' && newMin > 0) min = newMin;
    if (max < min) max = min;
    return { min, max };
}

function generateArray<T> (length: number, containing: () => T): T[] {
    return Array(length).fill(undefined).map(containing);
}
