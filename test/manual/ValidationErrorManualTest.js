import {
    // any,
    final,
    boolean,
    string,
    number,
    symbol,
    func,
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
    objectOf,
    shape,
    exactShape
} from '../../src/validators/Validators';
import Listenable from '../../src/listenable/Listenable';

new Listenable({ config: { onValidationError: 'log' } });

const describe = (text, fn) => {
    console.log('\n');
    // console.log(text);
    fn();
}
const it = describe;

describe('Validation error message', () => {
    it('should appear for validator: boolean', () => {
        const store = new Listenable({
            validator: {
                boolean: final
            }
        });

        store.set({ boolean: NaN });
    });
    it('should appear for validator: boolean', () => {
        const store = new Listenable({
            validator: {
                boolean: boolean
            }
        });

        store.set({ boolean: NaN });
    });
    it('should appear for validator: string', () => {
        const store = new Listenable({
            validator: {
                string: string
            }
        });

        store.set({ string: NaN });
    });
    it('should appear for validator: number', () => {
        const store = new Listenable({
            validator: {
                number: number
            }
        });

        store.set({ number: NaN });
    });
    it('should appear for validator: symbol', () => {
        const store = new Listenable({
            validator: {
                symbol: symbol
            }
        });

        store.set({ symbol: NaN });
    });
    it('should appear for validator: func', () => {
        const store = new Listenable({
            validator: {
                func: func
            }
        });

        store.set({ func: NaN });
    });
    it('should appear for validator: object', () => {
        const store = new Listenable({
            validator: {
                object: object
            }
        });

        store.set({ object: NaN });
    });
    it('should appear for validator: undef', () => {
        const store = new Listenable({
            validator: {
                undef: undef
            }
        });

        store.set({ undef: NaN });
    });
    it('should appear for validator: array', () => {
        const store = new Listenable({
            validator: {
                array: array
            }
        });

        store.set({ array: NaN });
    });
    it('should appear for validator: possiblyEmptyString', () => {
        const store = new Listenable({
            validator: {
                possiblyEmptyString: possiblyEmptyString
            }
        });

        store.set({ possiblyEmptyString: NaN });
    });
    it('should appear for validator: nullableObject', () => {
        const store = new Listenable({
            validator: {
                nullableObject: nullableObject
            }
        });

        store.set({ nullableObject: NaN });
    });
    it('should appear for validator: integer', () => {
        const store = new Listenable({
            validator: {
                integer: integer
            }
        });

        store.set({ integer: NaN });
    });
    it('should appear for validator: parsableInteger', () => {
        const store = new Listenable({
            validator: {
                parsableInteger: parsableInteger
            }
        });

        store.set({ parsableInteger: NaN });
    });
    it('should appear for validator: parsableNumber', () => {
        const store = new Listenable({
            validator: {
                parsableNumber: parsableNumber
            }
        });

        store.set({ parsableNumber: NaN });
    });
    it('should appear for validator: undefOr', () => {
        const store = new Listenable({
            validator: {
                undefOr: undefOr(boolean)
            }
        });

        store.set({ undefOr: NaN });
    });
    it('should appear for validator: oneOf', () => {
        const store = new Listenable({
            validator: {
                oneOf: oneOf([1337, 'leet'])
            }
        });

        store.set({ oneOf: NaN });
    });
    it('should appear for validator: oneOfType', () => {
        const store = new Listenable({
            validator: {
                oneOfType: oneOfType([boolean, string])
            }
        });

        store.set({ oneOfType: NaN });
    });
    it('should appear for validator: arrayOf', () => {
        const store = new Listenable({
            validator: {
                arrayOf: arrayOf(number)
            }
        });

        store.set({ arrayOf: ['lol'] });
    });
    it('should appear for validator: objectOf', () => {
        const store = new Listenable({
            validator: {
                objectOf: objectOf(oneOf([1, 2]))
            }
        });

        store.set({ objectOf: {foo: NaN} });
    });
    it('should appear for validator: shape', () => {
        const store = new Listenable({
            validator: {
                shape: shape({
                    foo: string,
                    bar: number
                })
            }
        });

        store.set({ shape: {foo: 1337, bar: 'leet' } });
    });
    it('should appear for validator: exactShape', () => {
        const store = new Listenable({
            validator: {
                exactShape: exactShape({
                    foo: string,
                    bar: number
                })
            }
        });

        store.set({ exactShape: { foo: 'leet', bar: 1337, baz: 'zoinks' } });
    });
});
