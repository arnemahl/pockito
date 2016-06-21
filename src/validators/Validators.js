export const any = () => true;
export const final = () => false;
export const boolean = (value) => typeof value === 'boolean';
export const string = (value) => typeof value === 'string';
export const number = (value) => typeof value === 'number';
export const symbol = (value) => typeof value === 'symbol';
export const func = (value) => typeof value === 'function';
export const object = (value) => typeof value === 'object';

export const undef = (value) => typeof value === 'undefined';
export const undefOr = (validator) => (value) => undef(value) || validator(value);

export const array = (value) => Array.isArray(value);

export const nonEmptyString = (value) => string(value) && !!string;
export const nonNullObject = (value) => object(value) && value !== null;

export const integer = (value) => Number.isInteger(value);
export const parsableInteger = (value) => Number.isInteger(Number.parseFloat(value, 10));
export const parsableFloat = (value) => !Number.isNaN(Number.parseFloat(value, 10));

export const oneOf = (possibleValues) => (value) => possibleValues.indexOf(value) !== -1;
export const oneOfType = (possibleTypes) => (value) => possibleTypes.some(type => type(value));
