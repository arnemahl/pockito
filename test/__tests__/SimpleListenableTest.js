import Listenable from '../../src/listenable/Listenable';

jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/validators/Validators');

const toBeSet = {
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

function evaluate(propNames) {
    propNames.forEach(key =>
        expect(toBeSet[key]).toEqual(notifiedOf[key])
    );

    expect(propNames.length).toEqual(Object.keys(notifiedOf).length);
}

describe('Listenable (with no arguments)', () => {

    it('adds and notifies omni-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener);
        Store.set(toBeSet);

        evaluate(propNames);
    });
    it('removes omni-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener);
        Store.set(toBeSet);
        Store.removeListener(listener);
        Store.set({
            'notListenedTo': 'asdf'
        });

        evaluate(propNames);
    });


    it('adds and notifies multi-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener, propNames);
        Store.set(toBeSet);

        evaluate(propNames);
    });
    it('removes multi-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener, propNames);
        Store.set(toBeSet);
        Store.removeListener(listener, propNames);
        Store.set({
            'notListenedTo': 'asdf'
        });

        evaluate(propNames);
    });


    it('adds and notifies single-prop-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener, 'foo');
        Store.set(toBeSet);

        evaluate(['foo']);
    });
    it('removes single-prop-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.addListener(listener, 'foo');
        Store.set(toBeSet);
        Store.removeListener(listener, 'foo');
        Store.set({
            'notListenedTo': 'asdf'
        });

        evaluate(['foo']);
    });

    it('has retroactive omni-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.set(toBeSet);
        Store.addListener(listener);

        evaluate(propNames);
    });
    it('has retroactive multi-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.set(toBeSet);
        Store.addListener(listener, propNames);

        evaluate(propNames);
    });
    it('has retroactive single-prop-listeners', () => {
        setup();

        const Store = new Listenable();
        Store.set(toBeSet);
        Store.addListener(listener, 'foo');

        evaluate(['foo']);
    });
});
