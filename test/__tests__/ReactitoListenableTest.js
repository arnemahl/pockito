import {Listenable as ReactitoListenable} from '../../src/reactito';

jest.unmock('../../src/validators/Validators');
jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/reactito');

const Store = new ReactitoListenable({
    initialState: {
        foo: 'foo',
        bar: 'bar'
    }
});

describe('Reactito.Listenable:', () => {

    it('lets React.Components listenWhileMounted', () => {
        let foo;
        let bar;
        let unmounted = false;

        const comp = {
            setState: function(obj) {
                if (obj.foo) {
                    foo = obj.foo;
                }
                if (obj.bar) {
                    bar = obj.bar;
                }
            },
            componentWillUnMount: function() {
                unmounted = true
            }
        };

        Store.listenWhileMounted(comp, ['foo', 'bar']);
        comp.componentWillUnMount();

        expect(foo).toEqual('foo');
        expect(bar).toEqual('bar');
        expect(unmounted).toEqual(true);
    });

    it('lets React.Components listenWhileMountedRemap', () => {
        let flip;
        let flop;
        let unmounted = false;

        const comp = {
            setState: function(obj) {
                if (obj.flip) {
                    flip = obj.flip;
                }
                if (obj.flop) {
                    flop = obj.flop;
                }
            },
            componentWillUnMount: function() {
                unmounted = true
            }
        }

        Store.listenWhileMountedRemap(comp, { foo: 'flip', bar: 'flop'});
        comp.componentWillUnMount();

        expect(flip).toEqual('foo');
        expect(flop).toEqual('bar');
        expect(unmounted).toEqual(true);
    });
});
