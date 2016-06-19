import ERRORS from './ERRORS';

export default class ListenableBase {

    static with = (...args) => new ListenableBase(...args);

    listeners = {};
    omniListeners = [];

    constructor({validator, initialState, ...otherProps}) {
        Object.keys(otherProps).forEach(key => {
            this[key] = otherProps[key];
        });

        this.validator = validator;

        if (typeof initialState === 'object') {
            this.set(initialState);
        }
    }

    _validateProp(propName, value, listenable) {
        if (typeof this.validator !== 'object') {
            this._handleError(new Error(`No validator provided to Listenable`, ERROR.set.undocumented));
            return true;
        }

        if (typeof this.validator[propName] !== 'function') {
            this._handleError(new Error(`Missing validator for "${propName}"`), ERROR.set.undocumented);
            return true;
        } else {
            return validator[propName](value, listenable);
        }
    }

    _addOmniListener(newListener) {
        this.omniListeners.push(newListener);

        return this._removeOmniListener.bind(this, newListener);
    }

    _addListener(newListener, propName) {
        (this.listeners[propName] = this.listeners[propName] || []).push(newListener);

        if (typeof this[propName] !== 'undefined') {
            const lastValue = void 0;
            const value = this[propName];
            newListener(value, lastValue, propName);
        }

        return this._removeListener.bind(this, newListener, propName);
    }

    addListener = (newListener, propNames) => {
        if (Array.isArray(propNames)) {
            return propNames.map(propName => this._addListener(newListener, propName));
        } else if (typeof propNames === 'string') {
            return this._addListener(newListener, propNames);
        } else {
            return this._addOmniListener(newListener);
        }
    }

    _removeOmniListener(oldListener) {
        const oldLength = this.omniListeners.length;

        this.omniListeners = this.omniListeners.filter(listener => listener !== oldListener);

        const nofRemoved = oldLength - this.omniListeners.length;

        if (nofRemoved !== 1) {
            this._handleError(new Error(`Tried to remove 1 omniListener, but removed ${nofRemoved}`), ERRORS.listener.remove);
        }
    }

    _removeListener(oldListener, propName) {
        if (!this.listeners[propName]) {
            this._handleError(new Error(`Could not remove listener, no listeners exists for "${propName}".`), ERRORS.listener.remove);
            return;
        }

        const oldLength = this.listeners[propName].length;

        this.listeners[propName] = this.listeners[propName].filter(({listener}) => listener !== oldListener);

        const nofRemoved = oldLength - this.listeners[propName].length;

        if (nofRemoved !== 1) {
            this._handleError(new Error(`Tried to remove 1 listener for "${propName}", but removed ${nofRemoved}.`), ERRORS.listener.remove);
        }
    }

    removeListener = (oldListener, propNames) => {
        if (Array.isArray(propNames)) {
            propNames.forEach(propName => this._removeListener(oldListener, propName));
        } else if (typeof propNames === 'string') {
            this._removeListener(oldListener, propNames);
        } else {
            this._removeOmniListener(oldListener);
        }
    }

    isValid = (propName, value) => {
        return this._validateProp(propName, value, this);
    }

    _ensureValid(propName, value) {
        if (!this.isValid(propName, value)) {
            this._handleError(new Error(`Error during set: Cannot set value ${value} to property ${propName}`), ERRORS.set.invalid);
        }
    }

    _set(propName, value) {
        this._ensureValid(propName, value);

        const lastValue = this[propName];

        if (lastValue === value) {
            if (typeof value === 'object' && value !== null) {
                this._handleError(
                    new Error(`Tried to set an object which was already present. propName: "${propName}", value: ${JSON.stringify(object)}`),
                    ERRORS.set.sameObject
                );
            }
            return;
        }

        this[propName] = value;

        this.listeners[propName] && this.listeners[propName].forEach(listener => listener(value, lastValue, propName));
    }

    set(props) {
        if (typeof props !== 'object') {
            this._handleError(
                new Error(`TypeError: Listenable.set can only take object: {propName: value [, propName2: value2]}. Got type ${typeof props}`),
                ERRORS.set.inputTypeError
            )
        }

        Object.keys(props).forEach(propName => {
            this._set(propName, props[propName]);
        });
    }

}
