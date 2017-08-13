function anyValue() {
    return true;
}

function unsettable() {
    return false;
}
unsettable.getError = function(value, key) {
    throw Error(`Cannot set a new value to store.${key}.`)
}

function flatMap(...)
function unique(...)

function Store(args) {
    var initialState = args.state || {};
    var validators = args.validators || [];
    var defaultValidator = args.defaultValidator || anyValue;
    var storeName = args.name;

    if (typeof initialState !== 'object') {
        throw Error('The initialState must be an object, unless omitted');
    }
    if (!Array.isArray(validators) || validators.some(fn => typeof fn !== 'function')) {
        throw Error('The validators must be an array of functions, unless omitted');
    }
    if (typeof defaultValidator !== 'function') {
        throw Error('The defaultValidator must be a function, unless omitted');
    }
    if (typeof storeName !== 'string' || storeName.length === 0) {
        throw Error('The name of a store must be a non-empty string')
    }

    // Do not allow overwriting the store methods
    validators.set = unsettable;
    validators.addListener = unsettable;
    validators.removeListener = unsettable;
    validators.onChange = unsettable;
    validators.offChange = unsettable;

    var store = this instanceof store
        ? this
        : {};

    store.name = storeName;

    var listenerMap = {};
    var omnilisteners = [];

    function getValidator(key) {
        return validators[key] || defaultValidator;
    }

    function getListener(key) {
        return listenerMap[key] || [];
    }

    store.set = function(partialState) {
        if (typeof partialState !== 'object') {
            throw TypeError('First argument to store.set(partialState) must be an object');
        }

        for (key in partialState) {
            var accepts = getValidator(key);
            var value = partialState[key];

            if (!accepts(value)) {
                var error = accepts.getError
                    ? accepts.getError(value, key, store)
                    : TypeError(`Value of ${key} in partialState was not accepted as ${accepts.name} in store ${storeName}`);

                throw error;
            }
        }

        for (key in partialState) {
            state[key] = partialState[key];
        }

        Object.keys(partialState)
            .map(getListener)
            .reduce(flatMap, [])
            .concat(omnilisteners)
            .filter(unique)
            .forEach(function (listener) {
                listener();
            });
    }

    store.addListener = function(keys, listener) {
        keys.forEach(key => {
            if (listenerMap[key] === void 0) {
                listenerMap[key] = [listener];
            } else {
                listenerMap[key].push(listener);
            }
        });

        return store.removeListener.bind(store, keys, listener);
    }

    store.removeListener = function(keys, listener) {
        listenerMap[keys] = listenerMap[keys].filter(fn => fn !== listener);
    }

    store.onChange = function(listener) {
        omnilisteners.push[listener];
    }

    store.offChange = function(listener) {
        omnilisteners = omnilisteners.filter(fn => fn !== listener);
    }

    store.set(initialState);

    return store;
}

module.exports = Store;
