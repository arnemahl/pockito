export const any = () => true;
export const final = (value, listenable) => !listenable._isInitialized;
export const boolean = (value) => typeof value === 'boolean';
export const string = (value) => typeof value === 'string' && !!value;
export const number = (value) => typeof value === 'number';
export const symbol = (value) => typeof value === 'symbol';
export const func = (value) => typeof value === 'function';
export const object = (value) => typeof value === 'object' && value !== null;

export const undef = (value) => typeof value === 'undefined';

export const array = (value) => Array.isArray(value);

export const possiblyEmptyString = (value) => typeof value === 'string';
export const nullableObject = (value) => typeof value === 'object';

export const integer = (value) => Number.isInteger(value);
export const parsableInteger = (value) => Number.isInteger(Number.parseFloat(value, 10));
export const parsableNumber = (value) => !Number.isNaN(Number.parseFloat(value, 10));

// Takes arguments
export const undefOr = (validator) => (value, l, p) => undef(value) || validator(value);

export const oneOf = (possibleValues) => (value) => possibleValues.indexOf(value) !== -1;
export const oneOfType = (possibleTypes) => (value) => possibleTypes.some(type => type(value));

export const arrayOf = (validator) => (value, l, p) => array(value) && value.every(v => validator(v, l, p));
export const objectOf = (validator) => (value, l, p) => object(value) && Object.keys(value).map(key => value[key]).every(v => validator(v, l, p));

export const shape = (obj) => (value) => value && Object.keys(obj).every(key => obj[key](value[key]));
export const exactShape = (obj) => (value) => shape(obj)(value) && Object.keys(value).every(key => Object.keys(obj).indexOf(key) !== -1);
