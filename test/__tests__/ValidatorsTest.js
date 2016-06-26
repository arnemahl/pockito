import {
    // any,
    // final,
    boolean,
    string,
    number,
    // symbol,
    // func,
    object,
    undef,
    array,
    possiblyEmptyString,
    nullableObject,
    integer,
    parsableInteger,
    parsableNumber,
    undefOr,
    oneOf,
    oneOfType,
    arrayOf,
    objectOf
} from '../../src/validators/Validators';

jest.unmock('../../src/validators/Validators');

describe('Validators', () => {
    it('boolean', () => {
        expect(boolean(true)).toEqual(true);
        expect(boolean(false)).toEqual(true);
        expect(boolean('true')).toEqual(false);
        expect(boolean('false')).toEqual(false);
        expect(boolean()).toEqual(false);
        expect(boolean(null)).toEqual(false);
        expect(boolean(0)).toEqual(false);
    });
    it('string', () => {
        expect(string('hello')).toEqual(true);
        expect(string('')).toEqual(false);
    });
    it('possiblyEmptyString', () => {
        expect(possiblyEmptyString('hello')).toEqual(true);
        expect(possiblyEmptyString('')).toEqual(true);
    });
    it('number', () => {
        expect(number(5)).toEqual(true);
        expect(number('5')).toEqual(false);
    });
    it('integer', () => {
        expect(integer(5)).toEqual(true);
        expect(integer(5.5)).toEqual(false);
        expect(integer('5')).toEqual(false);
    });
    it('parsableNumber', () => {
        expect(parsableNumber(5)).toEqual(true);
        expect(parsableNumber('5')).toEqual(true);
        expect(parsableNumber(5.5)).toEqual(true);
        expect(parsableNumber('5.5')).toEqual(true);
    });
    it('parsableInteger', () => {
        expect(parsableInteger(5)).toEqual(true);
        expect(parsableInteger('5')).toEqual(true);
        expect(parsableInteger(5.5)).toEqual(false);
        expect(parsableInteger('5.5')).toEqual(false);
    });
    it('object', () => {
        expect(object({})).toEqual(true);
        expect(object({foo: 'bar'})).toEqual(true);
        expect(object([])).toEqual(true); // Arrays are also objects
        expect(object(null)).toEqual(false);
    });
    it('nullableObject', () => {
        expect(nullableObject({})).toEqual(true);
        expect(nullableObject({foo: 'bar'})).toEqual(true);
        expect(nullableObject(null)).toEqual(true);
    });
    it('array', () => {
        expect(array([])).toEqual(true);
        expect(array(['hello'])).toEqual(true);
        expect(array({})).toEqual(false);
    });
    it('undef', () => {
        expect(undef()).toEqual(true);
        expect(undef('hello')).toEqual(false);
        expect(undef(false)).toEqual(false);
    });
    it('undefOr string', () => {
        const undefOrString = undefOr(string);

        expect(undefOrString()).toEqual(true);
        expect(undefOrString('hello')).toEqual(true);
        expect(undefOrString('')).toEqual(false);
    });
    it('oneOf', () => {
        const fooOrBar = oneOf(['foo', 'bar']);

        expect(fooOrBar('foo')).toEqual(true);
        expect(fooOrBar('bar')).toEqual(true);
        expect(fooOrBar('asdf')).toEqual(false);
    });
    it('oneOfType', () => {
        const stringOrNumber = oneOfType([string, number]);

        expect(stringOrNumber('hello')).toEqual(true);
        expect(stringOrNumber(5)).toEqual(true);
        expect(stringOrNumber({})).toEqual(false);
    });
    it('arrayOf', () => {
        const arrayOfString = arrayOf(string);

        expect(arrayOfString([])).toEqual(true);
        expect(arrayOfString(['hello'])).toEqual(true);
        expect(arrayOfString(['hello', 'world'])).toEqual(true);
        expect(arrayOfString(['hello', 'world', 5])).toEqual(false);
        expect(arrayOfString(['hello', 'world', 5])).toEqual(false);
        expect(arrayOfString({ foo: 'hello'})).toEqual(false);
        expect(arrayOfString('hello')).toEqual(false);
    });
    it('objectOf', () => {
        const objectOfString = objectOf(string);

        expect(objectOfString({})).toEqual(true);
        expect(objectOfString({ foo: 'hello'})).toEqual(true);
        expect(objectOfString({ foo: 'hello', bar: 'world'})).toEqual(true);
        expect(objectOfString({ foo: 'hello', bar: 'world', baz: 5})).toEqual(false);
        expect(objectOfString('hello')).toEqual(false);
        // Arrays are also objects
        expect(objectOfString(['hello'])).toEqual(true);
        expect(objectOfString(['hello', 'world'])).toEqual(true);
        expect(objectOfString(['hello', 'world', 5])).toEqual(false);
        expect(objectOfString(['hello', 'world', 5])).toEqual(false);
    });

    it('works-for-config', () => {

        const validator = {
            onValidationError: oneOf(['log', 'throw']),
            onUndocumentedError: oneOf(['none', 'log', 'throw']),
            onListenerError: oneOf(['log', 'throw']),
            onSameObjectError: oneOf(['none', 'log', 'throw']),
            onSetSuccess: oneOf(['none', 'log'])
        };

        const initialState = {
            onValidationError: 'log',
            onUndocumentedError: 'none',
            onListenerError: 'throw',
            onSameObjectError: 'log',
            onSetSuccess: 'none'
        };

        Object.keys(initialState).forEach(key => {
            const validate = validator[key];
            const value = initialState[key];

            console.log(validate);

            expect(validate(value)).toEqual(true);
        });
    });
});
