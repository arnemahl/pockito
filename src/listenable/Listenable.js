import {final} from './validators/Validators';

const ERRORS = {
    listener: {
        add: Symbol(),
        remove: Symbol()
    },
    set: {
        invalid: Symbol(),
        undocumented: Symbol(),
        sameObject: Symbol(),
        inputTypeError: Symbol()
    },
    reset: {
        noInitalState: Symbol(),
        noInitialStateForProp: Symbol()
    },
    config: {
        multiple: Symbol()
    }
};

const finalFields = {
    listeners: final,
    omniListeners: final,
    validator: final,
    initialState: final,
    config: final,
    subListenables: final,
    _addOmniListener: final,
    _addListener: final,
    addListener: final,
    _removeOmniListener: final,
    _removeListener: final,
    removeListener: final,
    isValid: final,
    _set: final,
    set: final,
    _reset: final,
    reset: final,
    _handleErrorAccordingToConfig: final,
    _handleError: final,
    finalize: final
};

const retrospection = {};

const pockito_listenable_class_identifyer = Symbol();
const isPockitoListenable = (value) => (
    value.constructor && value.constructor.pockito_listenable_class_identifyer === pockito_listenable_class_identifyer
);

class Listenable {

    static pockito_listenable_class_identifyer = pockito_listenable_class_identifyer;

    listeners = {};
    omniListeners = [];
    subListenables = [];

    constructor({config, validator, initialState, ...otherProps}) {
        Object.keys(otherProps).forEach(key => {
            const prop = otherProps[key];

            this[key] = prop;

            if (isPockitoListenable(prop)) {
                subListenables.push(prop);
            }
        });

        ['config'].forEach(key => {
            if (retrospection[key]) {
                this[key] = retrospection[key];
            }
        });

        if (config) {
            if (retrospection.configAlreadySet) {
                this._handleError(
                    Error("Config was set on multiple listenables. All listenables in a project share the same config,"
                        + " so you should only set config on one of them to get predictable results"),
                    ERRORS.config.multiple
                );
            } else {
                retrospection.configAlreadySet = true;
                this.config.set(config);
                this.config.finalize();
            }
        }

        this.validator = {...validator, ...finalFields};
        this.initialState = initialState;

        if (initialState) {
            this.set(initialState);
        }
    }

    finalize = () => {
        Object.keys(this.validator).forEach(key => {
            this.validator[key] = final;
        });

        subListenables.forEach(subListenable => subListenable.finalize());
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
            this._handleError(new Error(`Cannot reset property, "${propName}" has no initialState.`), ERRORS.reset.noInitialStateForProp);
        } else {
            this.set({
                [propName]: initialState[propName]
            });
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

    _handleErrorAccordingToConfig(error, config) {
        switch (config) {
            case 'log':
                console.error(error.message);
                break;
            case 'throw':
                throw error;
                break;
        }
    }

    _handleError(error, errorType) {
        if (!this.config) {
            error.message = 'Error during config setup: ' + error.message;
            throw error;
        }

        switch (errorType) {
            case ERRORS.set.undocumented:
                this._handleErrorAccordingToConfig(error, this.config.onUndocumentedError);
                break;
            case ERRORS.set.invalid:
                this._handleErrorAccordingToConfig(error, this.config.onValidationError);
                break;
            case ERRORS.set.sameObject:
                this._handleErrorAccordingToConfig(error, this.config.onSameObjectError);
                break;

            case ERRORS.listener.add:
            case ERRORS.listener.remove:
                this._handleErrorAccordingToConfig(error, this.config.onListenerError);
                break;

            case ERRORS.set.inputTypeError:
            case ERRORS.reset.noInitalState:
            case ERRORS.reset.noInitialStateForProp:
            case ERRORS.config.multiple:
                throw error;
                break;
        }
    }

}

retrospection.config = new Listenable({
    validator: {
        onValidationError: (value) => ['log', 'throw'].indexOf(value) !== -1,
        onUndocumentedError: (value) => ['none', 'log', 'throw'].indexOf(value) !== -1,
        onListenerError: (value) => ['log', 'throw'].indexOf(value) !== -1,
        onSameObjectError: (value) => ['none', 'log', 'throw'].indexOf(value) !== -1
    },
    initialState: {
        onValidationError: 'log',
        onUndocumentedError: 'none',
        onListenerError: 'trow',
        onSameObjectError: 'log'
    }
});

export default Listenable;
