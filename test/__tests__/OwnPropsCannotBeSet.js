import Listenable from '../../src/listenable/Listenable';

jest.unmock('../../src/listenable/Listenable');
jest.unmock('../../src/validators/Validators');

const Store = new Listenable({
    config: {
        onValidationError: 'throw'
    }
});

function canSet(propName) {
    try {
        Store.set({ [propName]: 'foo'});
        return true;
    } catch (e) {
        return false;
    }
}

describe('Listenable will not set to own props:', () => {

    // Fields
    it('protects _listeners', () => {
        expect(canSet('_listeners')).toEqual(false);
    });
    it('protects _omniListeners', () => {
        expect(canSet('_omniListeners')).toEqual(false);
    });
    it('protects _subListenables', () => {
        expect(canSet('_subListenables')).toEqual(false);
    });
    it('protects _config', () => {
        expect(canSet('_config')).toEqual(false);
    });
    it('protects _uniValidator', () => {
        expect(canSet('_uniValidator')).toEqual(false);
    });
    it('protects _validator', () => {
        expect(canSet('_validator')).toEqual(false);
    });
    it('protects _initialState', () => {
        expect(canSet('_initialState')).toEqual(false);
    });
    it('protects _isInitialized', () => {
        expect(canSet('_isInitialized')).toEqual(false);
    });

    // Methods
    it('protects finalize', () => {
        expect(canSet('finalize')).toEqual(false);
    });
    it('protects _addOmniListener', () => {
        expect(canSet('_addOmniListener')).toEqual(false);
    });
    it('protects _addListener', () => {
        expect(canSet('_addListener')).toEqual(false);
    });
    it('protects addListener', () => {
        expect(canSet('addListener')).toEqual(false);
    });
    it('protects _removeOmniListener', () => {
        expect(canSet('_removeOmniListener')).toEqual(false);
    });
    it('protects _removeListener', () => {
        expect(canSet('_removeListener')).toEqual(false);
    });
    it('protects removeListener', () => {
        expect(canSet('removeListener')).toEqual(false);
    });
    it('protects _getValidator', () => {
        expect(canSet('_getValidator')).toEqual(false);
    });
    it('protects isValid', () => {
        expect(canSet('isValid')).toEqual(false);
    });
    it('protects _set', () => {
        expect(canSet('_set')).toEqual(false);
    });
    it('protects set', () => {
        expect(canSet('set')).toEqual(false);
    });
    it('protects _reset', () => {
        expect(canSet('_reset')).toEqual(false);
    });
    it('protects reset', () => {
        expect(canSet('reset')).toEqual(false);
    });
    it('protects _configFor', () => {
        expect(canSet('_configFor')).toEqual(false);
    });
    it('protects _handleErrorAccordingToConfig', () => {
        expect(canSet('_handleErrorAccordingToConfig')).toEqual(false);
    });
    it('protects _handleError', () => {
        expect(canSet('_handleError')).toEqual(false);
    });

});
