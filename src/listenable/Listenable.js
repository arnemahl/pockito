import BaseListenable from './BaseListenable';
import ERRORS from './ERRORS';

export default class Listenable extends BaseListenable {

    static PL_CLASS_ID = Symbol();

    static config = BaseListenable.with({
        validator: {
            onValidationError: (value) => ['log', 'throw'].indexOf(value),
            onUndocumentedError: (value) => ['none', 'log', 'throw'].indexOf(value),
            onListenerError: (value) => ['log', 'throw'].indexOf(value),
            onSameObjectError: (value) => ['none', 'log', 'throw'].indexOf(value)
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
            super.set({config});

            Object.keys(args).forEach(key => {
                const value = args[key];

                if (value.constructor && value.constructor.PL_CLASS_ID === this.constructor.PL_CLASS_ID) {
                    value.set(config);
                }
            });
        }
    }

    _throwWithStackTrace(message) {
        throw
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
        switch (erroType) {
            case ERRORS.set.undocumented:
                _handleErrorAccordingToConfig(error, this.config.onUndocumentedError);
                break;
            case ERRORS.set.invalid:
                _handleErrorAccordingToConfig(error, this.config.onValidationError);
                break;
            case ERRORS.set.sameObject:
                _handleErrorAccordingToConfig(error, this.config.onSameObjectError);

            case ERRORS.listener.add:
            case ERRORS.listener.remove:
                _handleErrorAccordingToConfig(error, this.config.onListenerError);
                break;

            case ERRORS.set.inputTypeError:
            case ERRORS.reset.noInitalState:
            case ERRORS.reset.noInitialStateForProp:
                throw error;
                break;
        }
    }
}
