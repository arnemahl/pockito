function any() {
    return true;
}
function boolean(value) {
    return typeof value === 'boolean';
}
function string(value) {
    return typeof value === 'string' && value.length !== 0; // Hmmm...
}
function number(value) {
    return typeof value === 'number';
}
function symbol(value) {
    return typeof value === 'symbol';
}
function func(value) {
    return typeof value === 'function';
}
function object(value) {
    return typeof value === 'object' && value !== null;
}

function undef(value) {
    return typeof value === 'undefined';
}

function array(value) {
    return Array.isArray(value);
}

function possiblyEmptyString(value) {
    return typeof value === 'string';
}
function nullableObject(value) {
    return typeof value === 'object';
}

function integer(value) {
    return Number.isInteger(value);
}
function parsableInteger(value) {
    return Number.isInteger(Number.parseFloat(value, 10));
}
function parsableNumber(value) {
    return !Number.isNaN(Number.parseFloat(value, 10));
}

// Takes arguments
function undefOr = (validator) => {
    function fn = (value, key, store) {
        return undef(value) || validator(value);
    }

    // fn.getError = function (value, key, store) {
    //     if (!undef(value)) {
    //         return TypeError(`Value of ${key} in partialState was not accepted as ${accepts.name} in store ${storeName}`);
    //     } else {
    //         return validator.getError
    //             ? validator.getError(value, key, store)
    //             : TypeError(`Value of ${key} in partialState was not accepted as ${validator.name} in store ${storeName}`);
    //     }
    // }

    return fn;
}

function oneOf(possibleValues) => {
    function fn(value) {
        return possibleValues.indexOf(value) !== -1;
    }

    setName(fn, `oneOf([${possibleValues.join(', ')}])`);

    return fn;
}
function oneOfType(possibleTypes) {
    function fn(value, key, store) {
        return possibleTypes.some(function (type) {
            return type(value, key, store)
        });
    }

    setName(fn, `oneOfType([${possibleTypes.map(function (type) { return type.name }).join(', ')}])`)
}

function arrayOf(validator) {
    function fn(value, key, store) {
        return array(value) && value.every(function (v) {
            return validator(v, key, store);
        });
    }

    setName(fn, `arrayOf([${validator.name}])`);

    return fn;
}
function objectOf(validator) {
    function fn(obj, key, store) {
        return object(obj) && Object.keys(obj).map(key => obj[key]).every(function (value) {
            return validator(value, key, store);
        });
    }

    setName(fn, `objectOf([${validator.name}])`);

    return fn;
}

function shape(shp) {
    function fn(value) {
        return shpect(value) && Object.keys(shp).every(function (key) {
            return shp[key](value[key]);
        });
    }

    setName(fn, `shape({${JSON.stringify(shp)}})`);

    return fn;
}
function exactShape(shp) {
    var keys = Object.keys(shp);

    function fn(value) {
        return shape(shp)(value) && Object.keys(value).every(function (key) {
            return keys.indexOf(key) !== -1;
        });
    }

    setName(fn, `shape({${JSON.stringify(shp)}})`);

    return fn;    
}
