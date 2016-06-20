import BaseListenable from './BaseListenable';
import ERRORS from './ERRORS';

export default class Listenable extends BaseListenable {

    static PL_CLASS_ID = Symbol();

    config = new BaseListenable({
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

    constructor({config, ...args}) {
        super({...args});

        if (typeof config === 'object') {
            this.applyConfig(config);
        }
    }

    applyConfig = (config) => {
        this.config.set(config);

        Object.keys(this).forEach(key => {
            const possibleSubListenable = this[key];

            if (possibleSubListenable.constructor && possibleSubListenable.constructor.PL_CLASS_ID === this.constructor.PL_CLASS_ID) {
                possibleSubListenable.applyConfig(config);
            }
        });
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
            // Happens if there is an error in super constructor
            throw error;
            return;
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
                throw error;
                break;
        }
    }
}
