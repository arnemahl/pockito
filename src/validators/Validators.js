export const boolean = (value) => typeof value === 'boolean';
export const string = (value) => typeof value === 'string';
export const number = (value) => typeof value === 'number';
export const symbol = (value) => typeof value === 'symbol';
export const func = (value) => typeof value === 'function';
export const object = (value) => typeof value === 'object';

export const array = (value) => Array.isArray(value);

export const nonEmptyString = (value) => string(value) && !!string;
export const nonNullObject = (value) => object(value) && value !== null;

export const integer = (value) => Number.isInteger(value);
export const parasbleInteger = (value) => !Number.isNaN((Number.parseInt(value));
export const parasbleFloat = (value) => !Number.isNaN((Number.parseFloat(value));
