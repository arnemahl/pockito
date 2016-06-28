import Listenable from '../../src/listenable/Listenable';
import {string, number, final} from '../../src/validators/Validators';

jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/validators/Validators');

new Listenable({ // Only set config to one Listenable to apply to all
    config: {
        onValidationError: 'throw'
    }
});

describe('Listenable with initialState', () => {

    it('has retroactive listeners', () => {
        const res = {};
        function listener(value, l, propName) {
            res[propName] = value;
        }

        const Store = new Listenable({
            validator: {
                hello: string,
                foo: string
            },
            initialState: {
                hello: 'world',
                foo: 'bar'
            }
        });
        Store.addListener(listener);

        expect(res.hello).toEqual('world');
        expect(res.foo).toEqual('bar');
    });

    it('can be updated', () => {
        const res = {};
        function listener(value, l, propName) {
            res[propName] = value;
        }

        const Store = new Listenable({
            validator: {
                hello: string,
                foo: string
            },
            initialState: {
                hello: 'world',
                foo: 'bar'
            }
        });
        Store.set({
            hello: 'asdf',
            foo: 'lol'
        })
        Store.addListener(listener);

        expect(res.hello).toEqual('asdf');
        expect(res.foo).toEqual('lol');
    });

    it('can be reset', () => {
        const res = {};
        function listener(value, l, propName) {
            res[propName] = value;
        }

        const Store = new Listenable({
            validator: {
                hello: string,
                foo: string
            },
            initialState: {
                hello: 'world',
                foo: 'bar'
            }
        });
        Store.set({
            hello: 'asdf',
            foo: 'lol'
        })
        Store.reset(['hello', 'foo']);
        Store.addListener(listener);

        expect(res.hello).toEqual('world');
        expect(res.foo).toEqual('bar');
    });
});
