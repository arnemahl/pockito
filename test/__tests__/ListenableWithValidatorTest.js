import Listenable from '../../src/listenable/Listenable';
import {string, number, final} from '../../src/validators/Validators';

jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/validators/Validators');

const propsToSet = {
    hello: 'world',
    foo: 'bar'
};
const propNames = ['hello', 'foo'];
let notifiedOf = {};

function listener(value, lastValue, propName) {
    notifiedOf[propName] = value;
}

function setup() {
    notifiedOf = {};
}

function shouldBeSet(propNames) {
    propNames.forEach(key =>
        expect(propsToSet[key]).toEqual(notifiedOf[key])
    );

    expect(propNames.length).toEqual(Object.keys(notifiedOf).length);
}

const args = {
    validator: {
        hello: string,
        foo: string
    }
};

new Listenable({ // Only set config to one Listenable to apply to all
    config: {
        onValidationError: 'throw'
    }
});

describe('Listenable with validator', () => {

    it('adds and notifies omni-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener);
        Store.set(propsToSet);

        shouldBeSet(propNames);
    });
    it('removes omni-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener);
        Store.set(propsToSet);
        Store.removeListener(listener);
        Store.set({
            'notListenedTo': 'asdf'
        });

        shouldBeSet(propNames);
    });


    it('adds and notifies multi-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener, propNames);
        Store.set(propsToSet);

        shouldBeSet(propNames);
    });
    it('removes multi-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener, propNames);
        Store.set(propsToSet);
        Store.removeListener(listener, propNames);
        Store.set({
            'notListenedTo': 'asdf'
        });

        shouldBeSet(propNames);
    });


    it('adds and notifies single-prop-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener, 'foo');
        Store.set(propsToSet);

        shouldBeSet(['foo']);
    });
    it('removes single-prop-listeners', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener, 'foo');
        Store.set(propsToSet);
        Store.removeListener(listener, 'foo');
        Store.set({
            'notListenedTo': 'asdf'
        });

        shouldBeSet(['foo']);
    });

    it('disallows invalid values', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener);
        Store.set(propsToSet);

        let exeption;

        try {
            Store.set({
                'foo': 1337,
                'bar': {}
            });
            exeption = 'did NOT throw';
        } catch (e) {
            exeption = 'did throw';
        }

        expect(exeption).toEqual('did throw');

        shouldBeSet(propNames);
    });

    it('disallows new props when finalized', () => {
        setup();

        const Store = new Listenable(args);
        Store.addListener(listener);
        Store.set(propsToSet);
        Store.finalize();

        let exeption;

        try {
            Store.set({
                lol: 'asdf'
            });
            exeption = 'did NOT throw';
        } catch (e) {
            exeption = 'did throw';
        }

        expect(exeption).toEqual('did throw');
        expect(notifiedOf.lol).toEqual(void 0);
        shouldBeSet(propNames);
    });

    it('can use uniValidator to accept values', () => {
        setup();

        const Store = new Listenable({
            uniValidator: string
        });
        Store.addListener(listener);
        Store.set(propsToSet);

        shouldBeSet(propNames);
    });

    it('can use uniValidator to reject values', () => {
        setup();

        const Store = new Listenable({
            uniValidator: number
        });
        Store.addListener(listener);

        let exeption;

        try {
            Store.set(propsToSet);
            exeption = 'did NOT throw';
        } catch (e) {
            exeption = 'did throw';
        }

        expect(exeption).toEqual('did throw');
        expect(notifiedOf.hello).toEqual(void 0);
        expect(notifiedOf.foo).toEqual(void 0);
        expect(Object.keys(notifiedOf).length).toEqual(0);
    });

    it('can set final values in constructor (universally final)', () => {
        setup();

        const Store = new Listenable({
            uniValidator: final,
            initialState: propsToSet
        });
        Store.addListener(listener);

        shouldBeSet(propNames);
    });

    it('can set final values in constructor (individually final)', () => {
        setup();

        const Store = new Listenable({
            validator: {
                hello: final,
                world: final
            },
            initialState: propsToSet
        });
        Store.addListener(listener);

        shouldBeSet(propNames);
    });
});
