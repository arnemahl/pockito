jest.unmock('../../src/validators/Validators');
jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/reactito');

jest.unmock('../../src/index');

describe('Pockito library', () => {

    it('Allows destructuring on import', () => {
        const {Listenable, Validators, Reactito} = require('../../src/index');

        expect('Listenable: ' + typeof Listenable).toEqual('Listenable: function');
        expect('Validators: ' + typeof Validators).toEqual('Validators: object');
        expect('Reactito: ' + typeof Reactito).toEqual('Reactito: object');

        const { Reactito: {
            StateInjector,
            listenWhileMounted,
            listenWhileMountedRemap,
            Listenable: ReactitoListenable
        }} = require('../../src/index');

        expect('StateInjector: ' + typeof StateInjector).toEqual('StateInjector: function');
        expect('listenWhileMounted: ' + typeof listenWhileMounted).toEqual('listenWhileMounted: function');
        expect('listenWhileMountedRemap: ' + typeof listenWhileMountedRemap).toEqual('listenWhileMountedRemap: function');
        expect('ReactitoListenable: ' + typeof ReactitoListenable).toEqual('ReactitoListenable: function');
    });

});
