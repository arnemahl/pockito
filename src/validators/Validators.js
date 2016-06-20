export const any = () => true;
export const final = () => false;
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
export const parsableInteger = (value) => !Number.isNaN(Number.parseInt(value));
export const parsableFloat = (value) => !Number.isNaN(Number.parseFloat(value));

export const oneOf = (possibleValues) => (value) => possibleValues.indexOf(value) !== -1;
export const oneOfType = (possibleTypes) => (value) => possibleTypes.find(type => type(value));
