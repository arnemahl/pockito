export const any = () => true;
export const final = (value, listenable) => !listenable._isInitialized;
export const boolean = (value) => typeof value === 'boolean';
export const string = (value) => typeof value === 'string' && !!value;
export const number = (value) => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
export const symbol = (value) => typeof value === 'symbol';
export const func = (value) => typeof value === 'function';
export const object = (value) => typeof value === 'object' && value !== null;

export const undef = (value) => typeof value === 'undefined';

export const array = (value) => Array.isArray(value);

export const possiblyEmptyString = (value) => typeof value === 'string';
export const nullableObject = (value) => typeof value === 'object';

export const integer = (value) => Number.isInteger(value);
export const parsableInteger = (value) => Number.isInteger(Number.parseFloat(value, 10));
export const parsableNumber = (value) => number(Number.parseFloat(value, 10));

// Takes arguments
export const undefOr = (validator) => {
    const instanceOfUndefOr = (value, l, p) => undef(value) || validator(value);
    undefOr.appendMethods(instanceOfUndefOr, validator);
    return instanceOfUndefOr;
};

export const oneOf = (possibleValues) => {
    const instanceOfOneOf = (value) => possibleValues.indexOf(value) !== -1;
    oneOf.appendMethods(instanceOfOneOf, possibleValues);
    return instanceOfOneOf;
};

export const oneOfType = (possibleTypes) => {
    const instanceOfOneOfType = (value) => possibleTypes.some(type => type(value));
    oneOfType.appendMethods(instanceOfOneOfType, possibleTypes);
    return instanceOfOneOfType;
}

export const arrayOf = (validator) => {
    const instanceOfArrayOf = (value, l, p) => array(value) && value.every(v => validator(v, l, p));
    arrayOf.appendMethods(instanceOfArrayOf, validator);
    return instanceOfArrayOf;
};

export const objectOf = (validator) => {
    const instanceOfObjectOf = (value, l, p) => object(value) && Object.keys(value).map(key => value[key]).every(v => validator(v, l, p));
    objectOf.appendMethods(instanceOfObjectOf, validator);
    return instanceOfObjectOf;
};

export const shape = (obj) => {
    const instanceOfShape = (value) => value && Object.keys(obj).every(key => obj[key](value[key]));
    shape.appendMethods(instanceOfShape, obj);
    return instanceOfShape;
};

export const exactShape = (obj) => {
    const instanceOfExactShape = (value) => shape(obj)(value) && Object.keys(value).every(key => Object.keys(obj).indexOf(key) !== -1);
    exactShape.appendMethods(instanceOfExactShape, obj);
    return instanceOfExactShape;
};


// Generating error messages
const okMsg = 'The value was accepted.';
// const accepts = 'The value was not accepted because its validator';
const sprtr = '\n-';
const validatorName = `${sprtr} Validator: `;
const accepts = `${sprtr} Accepts: `;
const rejected = `${sprtr} Rejected: the provided value`;

final.accepts = () => 'no updates after initialization';
final.didNotAcceptValueBecauseIt = () => ' cannot be set after initialization'
final.getMessage = (value, listenable) => final(value, listenable)
    ? okMsg
    : validatorName + final.name
    + `${sprtr} Rejected: This property is final, which means that it cannot be set after initialization.`;

boolean.accepts = () => 'boolean values';
boolean.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
boolean.getMessage = (value) => boolean(value)
    ? okMsg
    : validatorName + boolean.name
    + accepts + boolean.accepts()
    + rejected + `${boolean.didNotAcceptValueBecauseIt(value)}.`;

string.accepts = () => `non-empty strings`;
string.didNotAcceptValueBecauseIt = (value) => typeof value !== 'string' ? ` was of type ${typeof value}` : ' was an empty string';
string.getMessage = (value) => string(value)
    ? okMsg
    : validatorName + string.name
    + accepts + string.accepts()
    + rejected + `${string.didNotAcceptValueBecauseIt(value)}.`;

number.accepts = () => `numbers, which may not be NaN or Infinity`;
number.didNotAcceptValueBecauseIt = (value) => ` was ${typeof value !== 'number' ? `of type ${typeof value}` : value}`;
number.getMessage = (value) => number(value)
    ? okMsg
    : validatorName + number.name
    + accepts + number.accepts()
    + rejected + `${number.didNotAcceptValueBecauseIt(value)}.`;

symbol.accepts = () => `symbol values`;
symbol.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
symbol.getMessage = (value) => symbol(value)
    ? okMsg
    : validatorName + symbol.name
    + accepts + symbol.accepts()
    + rejected + `${symbol.didNotAcceptValueBecauseIt(value)}.`;

func.accepts = () => `function values`;
func.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
func.getMessage = (value) => func(value)
    ? okMsg
    : validatorName + accepts.name
    + accepts + func.accepts()
    + rejected + `${func.didNotAcceptValueBecauseIt(value)}.`;

object.accepts = () => `object values, which may not be null`;
object.didNotAcceptValueBecauseIt = (value) => ` was ${typeof value !== 'object' ? `of type ${typeof value}` : value}`;
object.getMessage = (value) => object(value)
    ? okMsg
    : validatorName + object.name
    + accepts + object.accepts()
    + rejected + `${object.didNotAcceptValueBecauseIt(value)}.`;

undef.accepts = () => `undefined values`;
undef.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
undef.getMessage = (value) => undef(value)
    ? okMsg
    : validatorName + undef.name
    + accepts + undef.accepts()
    + rejected + `${undef.didNotAcceptValueBecauseIt(value)}.`;

array.accepts = () => `array values`;
array.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
array.getMessage = (value) => array(value)
    ? okMsg
    : validatorName + array.name
    + accepts + array.accepts()
    + rejected + `${array.didNotAcceptValueBecauseIt(value)}.`;

possiblyEmptyString.accepts = () => `string values, which may be empty`;
possiblyEmptyString.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
possiblyEmptyString.getMessage = (value) => possiblyEmptyString(value)
    ? okMsg
    : validatorName + possiblyEmptyString.name
    + accepts + possiblyEmptyString.accepts()
    + rejected + `${possiblyEmptyString.didNotAcceptValueBecauseIt(value)}.`;

nullableObject.accepts = () => `object values, which may be null`;
nullableObject.didNotAcceptValueBecauseIt = (value) => ` was of type ${typeof value}`;
nullableObject.getMessage = (value) => nullableObject(value)
    ? okMsg
    : validatorName + nullableObject.name
    + accepts + nullableObject.accepts()
    + rejected + `${nullableObject.didNotAcceptValueBecauseIt(value)}.`;

integer.accepts = () => `integer values`;
integer.didNotAcceptValueBecauseIt = (value) => ` was ${typeof value !== 'number' ? `of type ${typeof value}` : value}`;
integer.getMessage = (value) => integer(value)
    ? okMsg
    : validatorName + integer.name
    + accepts + integer.accepts()
    + rejected + `${integer.didNotAcceptValueBecauseIt(value)}.`;

parsableInteger.accepts = () => `values that can be parsed as a number, where the resulting value is an integer`;
parsableInteger.didNotAcceptValueBecauseIt = (value) => `${Number.parseFloat(value) === NaN ? ' could not be parsed as a number' : `, when parsed, resulted in ${Number.parseFloat(value)}, which is not an integer`}`;
parsableInteger.getMessage = (value) => parsableInteger(value)
    ? okMsg
    : validatorName + parsableInteger.name
    + accepts + parsableInteger.accepts()
    + rejected + `${parsableInteger.didNotAcceptValueBecauseIt(value)}.`;

parsableNumber.accepts = () => `values that can be parsed as number, where the resulting value is not NaN or Infinity`;
parsableNumber.didNotAcceptValueBecauseIt = (value) => ` when parsed, resulted in ${Number.parseFloat(value)}`;
parsableNumber.getMessage = (value) => parsableNumber(value)
    ? okMsg
    : validatorName + parsableNumber.name
    + accepts + parsableNumber.accepts()
    + rejected + `${parsableNumber.didNotAcceptValueBecauseIt(value)}.`;

// More complicated ones
undefOr.appendMethods = (instanceOfUndefOr, validator) => {
    instanceOfUndefOr.accepts = () => `values that are undefined or ${validator.accepts()}`;
    instanceOfUndefOr.didNotAcceptValueBecauseIt = (value) => ` was not undefined and${validator.didNotAcceptValueBecauseIt(value)}`;
    instanceOfUndefOr.getMessage = (value) => instanceOfUndefOr(value)
        ? okMsg
        : validatorName + instanceOfUndefOr.name
        + accepts + instanceOfUndefOr.accepts()
        + rejected + `${instanceOfUndefOr.didNotAcceptValueBecauseIt(value)}.`;
};

oneOf.appendMethods = (instanceOfOneOf, possibleValues) => {
    const stringify = someVal => typeof someVal === 'string' ? `'${someVal}'` : String(someVal);

    instanceOfOneOf.accepts = () => `values equal to one of ${possibleValues.map(stringify).join(' or ')}`;
    instanceOfOneOf.didNotAcceptValueBecauseIt = (value) => ` ${stringify(value)} did not match any of the possible values`;
    instanceOfOneOf.getMessage = (value) => instanceOfOneOf(value)
        ? okMsg
        : validatorName + instanceOfOneOf.name
        + accepts + instanceOfOneOf.accepts()
        + rejected + `${instanceOfOneOf.didNotAcceptValueBecauseIt(value)}.`;
};

oneOfType.appendMethods = (instanceOfOneOfType, possibleTypes) => {
    instanceOfOneOfType.accepts = () => `values that are either ${possibleTypes.map(pt => pt.accepts()).join(' or ')}`;
    instanceOfOneOfType.didNotAcceptValueBecauseIt = (value) => ` was not accepted as any of the possible types`;
    instanceOfOneOfType.getMessage = (value) => instanceOfOneOfType(value)
        ? okMsg
        : validatorName + instanceOfOneOfType.name
        + accepts + instanceOfOneOfType.accepts()
        + rejected + `${instanceOfOneOfType.didNotAcceptValueBecauseIt(value)}.`;
};

arrayOf.appendMethods = (instanceOfArrayOf, validator) => {
    instanceOfArrayOf.accepts = () => `arrays containing ${validator.accepts()}`;
    instanceOfArrayOf.didNotAcceptValueBecauseIt = (value) => !array(value)
        ? ` was not an array.`
        : ` contains values that were not accepted:\n\t* ${value.filter(v => !validator(v)).map(validator.didNotAcceptValueBecauseIt).join('\n\t* ')}`;
    instanceOfArrayOf.getMessage = (value) => instanceOfArrayOf(value)
        ? okMsg
        : validatorName + instanceOfArrayOf.name
        + accepts + instanceOfArrayOf.accepts()
        + rejected + `${instanceOfArrayOf.didNotAcceptValueBecauseIt(value)}`;
}

objectOf.appendMethods = (instanceOfObjectOf, validator) => {
    instanceOfObjectOf.accepts = () => `objects containing ${validator.accepts()}`;
    instanceOfObjectOf.didNotAcceptValueBecauseIt = (value) => !object(value)
        ? object.didNotAcceptValueBecauseIt(value)
        : ` contains values that were not accepted:\n\t* ${Object.keys(value).map(key => value[key]).filter(v => !validator(v)).map(validator.didNotAcceptValueBecauseIt).join('\n\t* ')}`;
    instanceOfObjectOf.getMessage = (value) => objectOf(validator)(value)
        ? okMsg
        : validatorName + instanceOfObjectOf.name
        + accepts + instanceOfObjectOf.accepts()
        + rejected + `${instanceOfObjectOf.didNotAcceptValueBecauseIt(value)}`;
}

shape.appendMethods = (instanceOfShape, obj) => {
    const toPropAcceptsDescription = key => `* ${key}: ${obj[key].name} (${obj[key].accepts()})`;
    const toPropRejectedDescription = (key, value) => `* ${key}: ${obj[key].name} (${obj[key].didNotAcceptValueBecauseIt(value)})`;

    instanceOfShape.accepts = () => `objects where the following properties are:\n\t${Object.keys(obj).map(toPropAcceptsDescription).join('\n\t')}`;
    instanceOfShape.didNotAcceptValueBecauseIt = (value) => typeof value !== 'object'
        ? ' was not an object'
        : ' contains the following properties that were not accepted:\n\t'
        + Object.keys(obj).filter(key => !obj[key](value[key])).map(key => toPropRejectedDescription(key, value)).join('\n\t');

    instanceOfShape.getMessage = (value) => instanceOfShape(value)
        ? okMsg
        : validatorName + instanceOfShape.name
        + accepts + `${instanceOfShape.accepts()} `
        + rejected + `${instanceOfShape.didNotAcceptValueBecauseIt(value)}`;
}

exactShape.appendMethods = (instanceOfExactShape, obj) => {
    const toPropAcceptsDescription = key => `* ${key}: ${obj[key].name} (${obj[key].accepts()})`;
    const toPropRejectedDescription = (key, value) => `* ${key}: ${obj[key].name} (${obj[key].didNotAcceptValueBecauseIt(value)})`;

    instanceOfExactShape.accepts = () => `objects with the exactly the following properties:\n\t${Object.keys(obj).map(toPropAcceptsDescription).join('\n\t')}`;
    instanceOfExactShape.didNotAcceptValueBecauseIt = (value) =>
        typeof value !== 'object' && ' was not an object' ||
        !shape(obj)(value) && shape(obj).didNotAcceptValueBecauseIt(value) ||
        ' contains the following unexpected properties:\n\t* ' + Object.keys(value).filter(key => typeof obj[key] !== 'function').join('\n\t* ');
    instanceOfExactShape.getMessage = (value) => instanceOfExactShape(value)
        ? okMsg
        : validatorName + instanceOfExactShape.name
        + accepts + `${instanceOfExactShape.accepts()} `
        + rejected + `${instanceOfExactShape.didNotAcceptValueBecauseIt(value)}`;
}
