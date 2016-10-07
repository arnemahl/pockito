import {final, oneOf} from '../validators/Validators';

const ERRORS = {
    listener: {
        add: Symbol(),
        remove: Symbol()
    },
    set: {
        invalid: Symbol(),
        undocumented: Symbol(),
        sameObject: Symbol(),
        inputTypeError: Symbol(),
        success: Symbol()
    },
    reset: {
        noInitalState: Symbol(),
        noInitialStateForProp: Symbol()
    },
    config: {
        multiple: Symbol()
    }
};

const ownProp = () => false; // Don't allow setting, even in constructor

const ownProps = {
    _listeners: ownProp,
    _omniListeners: ownProp,
    _uniValidator: ownProp,
    _validator: ownProp,
    _initialState: ownProp,
    _config: ownProp,
    _subListenables: ownProp,
    _addOmniListener: ownProp,
    _addListener: ownProp,
    addListener: ownProp,
    _removeOmniListener: ownProp,
    _removeListener: ownProp,
    removeListener: ownProp,
    _getValidator: ownProp,
    isValid: ownProp,
    _set: ownProp,
    set: ownProp,
    _reset: ownProp,
    reset: ownProp,
    _handleErrorAccordingToConfig: ownProp,
    _handleError: ownProp,
    _isInitialized: ownProp,
    finalize: ownProp,
    listenWhileMountedRemap: ownProp, // quick fix, comes from Reactito
    listenWhileMounted: ownProp // quick fix, comes from Reactito
};

const isOwnProp = propName => ownProps[propName];

const retrospection = {};

const pockito_listenable_class_identifyer = Symbol();
const isPockitoListenable = (value) => (
    value && value.constructor && value.constructor.pockito_listenable_class_identifyer === pockito_listenable_class_identifyer
);

class Listenable {

    static pockito_listenable_class_identifyer = pockito_listenable_class_identifyer;

    _listeners = {};
    _omniListeners = [];
    _subListenables = [];

    constructor(args) {
        const {config, uniValidator, validator, initialState, ...otherProps} = args || {};

        Object.keys(otherProps).forEach(key => {
            const prop = otherProps[key];

            this[key] = prop;

            if (isPockitoListenable(prop)) {
                this._subListenables.push(prop);
            }
        });

        if (retrospection.config) {
            this._config = retrospection.config;
        }

        if (config) {
            if (retrospection.configAlreadySet) {
                this._handleError(
                    Error("Config was set on multiple listenables. All listenables in a project share the same config,"
                        + " so you should only set config on one of them to get predictable results"),
                    ERRORS.config.multiple
                );
            } else {
                retrospection.configAlreadySet = true;
                this._config.set(config);
                this._config.finalize();
            }
        }

        this._uniValidator = uniValidator;
        this._validator = {...validator, ...ownProps};
        this._initialState = initialState;

        if (initialState) {
            this.set(initialState);
        }

        this._isInitialized = true;
    }

    finalize = () => {
        Object.keys(this._validator).forEach(key => {
            this._validator[key] = final;
            this._uniValidator = final;
        });

        this._subListenables.forEach(subListenable => subListenable.finalize());
    }

    _addOmniListener(newListener) {
        this._omniListeners.push(newListener);

        Object.keys(this).forEach(propName => {
            const value = this[propName];
            const lastValue = void 0;

            if (!isOwnProp(propName) && !isPockitoListenable(value)) {
                newListener(value, lastValue, propName);
            }
        });
    }

    _addListener(newListener, propName) {
        (this._listeners[propName] = this._listeners[propName] || []).push(newListener);

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
        const oldLength = this._omniListeners.length;

        this._omniListeners = this._omniListeners.filter(listener => listener !== oldListener);

        const nofRemoved = oldLength - this._omniListeners.length;

        if (nofRemoved !== 1) {
            this._handleError(new Error(`Tried to remove 1 omniListener, but removed ${nofRemoved}`), ERRORS.listener.remove);
        }
    }

    _removeListener(oldListener, propName) {
        if (!this._listeners[propName]) {
            this._handleError(new Error(`Could not remove listener, no listeners exists for "${propName}".`), ERRORS.listener.remove);
            return;
        }

        const oldLength = this._listeners[propName].length;

        this._listeners[propName] = this._listeners[propName].filter(listener => listener !== oldListener);

        const nofRemoved = oldLength - this._listeners[propName].length;

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

    _getValidator(propName, value) {
        if (typeof this._validator[propName] === 'function') {
            return this._validator[propName];

        } else if (typeof this._uniValidator === 'function') {
            return this._uniValidator;

        } else {
            return void 0;
        }
    }

    isValid = (propName, value) => {
        const validator = this._getValidator(propName, value);

        if (validator) {
            return validator(value, this, propName);
        } else {
            this._handleError(new Error(`Missing validator for "${propName}"`), ERRORS.set.undocumented);
            return true;
        }
    }

    _set(propName, value) {
        if (!this.isValid(propName, value)) {
            const validatorString = this._getValidator(propName, value).toString();

            this._handleError(new Error(`Attempted setting invalid value ${JSON.stringify(value)} to property "${propName}". Validator: ${validatorString}`), ERRORS.set.invalid);
            return;
        }

        const lastValue = this[propName];

        if (propName in this && lastValue === value) {
            if (typeof value === 'object' && value !== null) {
                this._handleError(
                    new Error(`Tried to set an object which was already present. propName: "${propName}", value: ${JSON.stringify(value)}`),
                    ERRORS.set.sameObject
                );
            }
            return;
        }

        this[propName] = value;

        if (this._configFor('onSetSuccess') === 'log') {
            console.log(`Set: [${propName}]: ${value}.`, this);
        }

        const notify = listener => listener(value, lastValue, propName);

        this._listeners[propName] && this._listeners[propName].forEach(notify);
        this._omniListeners.forEach(notify);
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

    _reset = (propName) => {
        if (!this._initialState[propName]) {
            this._handleError(new Error(`Cannot reset property, "${propName}" has no initialState.`), ERRORS.reset.noInitialStateForProp);
        } else {
            this._set(propName, this._initialState[propName]);
        }
    }

    reset = (propNames) => {
        if (!this._initialState) {
            this._handleError(new Error(`Cannot reset properties, initialState was not provided.`), ERRORS.reset.noInitalState)
        }

        const doReset = () => {
            if (Array.isArray(propNames)) {
                propNames.forEach(this._reset);
            } else if (typeof propNames === 'string') {
                this._reset(propNames);
            } else {
                this.set(this._initialState);
            }
        };

        const _handleError = this._handleError;
        this._handleError = () => {}; // Ignore errors during reset, potential errors are already checked for

        doReset();

        this._handleError = _handleError;
    }

    _configFor(configPropName) {
        return this._config && this._config[configPropName];
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
        if (!this._config) {
            error.message = 'Error during config setup: ' + error.message;
            throw error;
        }

        switch (errorType) {
            case ERRORS.set.undocumented:
                this._handleErrorAccordingToConfig(error, this._config.onUndocumentedError);
                break;
            case ERRORS.set.invalid:
                this._handleErrorAccordingToConfig(error, this._config.onValidationError);
                break;
            case ERRORS.set.sameObject:
                this._handleErrorAccordingToConfig(error, this._config.onSameObjectError);
                break;

            case ERRORS.listener.add:
            case ERRORS.listener.remove:
                this._handleErrorAccordingToConfig(error, this._config.onListenerError);
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
        onValidationError: oneOf(['log', 'throw']),
        onUndocumentedError: oneOf(['none', 'log', 'throw']),
        onListenerError: oneOf(['log', 'throw']),
        onSameObjectError: oneOf(['none', 'log', 'throw']),
        onSetSuccess: oneOf(['none', 'log'])
    },
    uniValidator: final,
    initialState: {
        onValidationError: 'log',
        onUndocumentedError: 'none',
        onListenerError: 'throw',
        onSameObjectError: 'log',
        onSetSuccess: 'none'
    }
});

export default Listenable;
