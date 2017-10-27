function anyValue() {
    return true;
}

function unsettable() {
    return false;
}
unsettable.getError = function(value, key) {
    throw Error(`store.${key} is a protected property and cannot be changed through store.set`)
}

function flatMap(...)
function unique(...)

function Store(args) {
    var initialState = args.initialState || {};
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

    // new stuff: on/off
    function getKeys(args) {
        if (Array.isArray(args[0])) {
            if (args.length > 2) {
                throw 'Array and then more props.. not ok';
            }
            return args[0];
        } else {
            return args.slice(0, args.length - 2);
        }
    }

    function containsInvalidKey(keys) {
        return keys.some(function (key) {
            return typeof key !== 'string' && typeof key !== 'number';
        });
    }

    store.on = function () {
        var args = Array.prototype.slice.call(arguments);
        var len = args.length;

        var listener = args[len-1];

        if (typeof listener !== 'function') {
            throw Error('The last argument must be a listener function');
        }

        if (len === 1) {
            return store.onChange(listener);
        } else {
            var keys = getKeys(args);

            if (containsInvalidKey(keys)) {
                throw 'Property names must be strings or numbers';
            }

            return store.addListener(keys, listener);
        }
    }

    store.off = function () {
        var args = Array.prototype.slice.call(arguments);
        var len = args.length;

        var listener = args[len-1];

        if (typeof listener !== 'function') {
            throw Error('The last argument must be a listener function');
        }

        if (len === 1) {
            store.offChange(listener);
        } else {
            var keys = getKeys(args);

            if (containsInvalidKey(keys)) {
                throw 'Property names must be strings or numbers';
            }

            store.removeListener(keys, listener);
        }
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
