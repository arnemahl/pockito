import ERRORS from './ERRORS';

export default class BaseListenable {

    listeners = {};
    omniListeners = [];

    constructor({validator, initialState, ...otherProps}) {
        Object.keys(otherProps).forEach(key => {
            this[key] = otherProps[key];
        });

        this.validator = validator;
        this.initialState = initialState;

        if (initialState) {
            Object.keys(initialState).forEach(key => {
                this[key] = initialState[key];
            });
            // this.set(initialState);
        }
    }

    // Overridden in Listenable
    _handleError(error) {
        throw error;
    }

    _addOmniListener(newListener) {
        this.omniListeners.push(newListener);
    }

    _addListener(newListener, propName) {
        (this.listeners[propName] = this.listeners[propName] || []).push(newListener);

        if (typeof this[propName] !== 'undefined') {
            const lastValue = void 0;
            const value = this[propName];
            newListener(value, lastValue, propName);
        }
    }

    addListener = (newListener, propNames) => {
        if (Array.isArray(propNames)) {
            propNames.forEach(propName => this._addListener(newListener, propName));
        } else if (typeof propNames === 'string') {
            this._addListener(newListener, propNames);
        } else if (typeof propNames === 'undefined') {
            this._addOmniListener(newListener);
        } else {
            this._handleError(new Error(`Invalid type of propNames: ${typeof propNames}`), ERRORS.listener.add);
        }
        return this.removeListener.bind(this, newListener, propNames);
    }

    _removeOmniListener = (oldListener) => {
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
        } else if (typeof propNames === 'undefined') {
            this._removeOmniListener(oldListener);
        } else {
            this._handleError(new Error(`Invalid type of propNames: ${typeof propNames}`), ERRORS.listener.remove);
        }
    }

    isValid = (propName, value) => {
        if (typeof this.validator !== 'object') {
            this._handleError(new Error(`No validator provided to Listenable`), ERRORS.set.undocumented);
            return true;
        }

        if (typeof this.validator[propName] !== 'function') {
            this._handleError(new Error(`Missing validator for "${propName}"`), ERRORS.set.undocumented);
            return true;
        } else {
            return this.validator[propName](value, this);
        }
    }

    _set(propName, value) {
        if (!this.isValid(propName, value)) {
            this._handleError(new Error(`Attempted setting invalid value ${JSON.stringify(value)} to property "${propName}"`), ERRORS.set.invalid);
            return;
        }

        const lastValue = this[propName];

        if (lastValue === value) {
            if (typeof value === 'object' && value !== null) {
                this._handleError(
                    new Error(`Tried to set an object which was already present. propName: "${propName}", value: ${JSON.stringify(value)}`),
                    ERRORS.set.sameObject
                );
            }
            return;
        }

        this[propName] = value;

        const notify = listener => listener(value, lastValue, propName);

        this.listeners[propName] && this.listeners[propName].forEach(notify);
        this.omniListeners.forEach(notify);
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

    _reset(propName) {
        if (!this.initialState[propName]) {
            this._handleError(new Error(`Cannot reset property, "${propName}" has no initialState.`), ERRORS.reset.noInitialStateForProp)
        }
    }

    reset(propNames) {
        if (!this.initialState) {
            this._handleError(new Error(`Cannot reset properties, initialState was not provided.`), ERRORS.reset.noInitalState)
        }

        if (Array.isArray(propNames)) {
            propNames.forEach(this._reset);
        } else if (typeof propNames === 'string') {
            this._reset(propNames);
        } else {
            this.set(initialState);
        }
    }

}
