export type TGenerator = () => TValue;
export type TValue = number | string | boolean | Date | TData | TGenerator | null | undefined | TValue[];
export type TData = { [key: string]: TValue };
