#API

Pockito revolves around the [Listenable](#listenable) class, which you can use to create your store, possibly with sub-stores. If you want to validate your store content, you can easily do so by providing functions which accepts or rejects an update to your listenable. To make this easier, Pockito comes with a set of defined [validators](#validators) that you can use.





# Listenable

| method                                       | prameters                                                                |
|----------------------------------------------|--------------------------------------------------------------------------|
| [constructor](#listenableconstructor)        | [obj: {[initiaState], [validator], [uniValidator], [config]}]            |
| [set](#listenableset)                        | obj: { propName(s): value(s) }                                           |
| [addListener](#listenableaddlistener)        | listener [prop(s)]                                                       |
| [removeListener](#listenableremovelistener)  | listener                                                                 |
| [isValid](#listenableisvalid)                | obj: { propName(s): value(s) }                                           |
| [reset](#listenablereset)                    | array of propName(s)                                                     |
| [finalize](#listenablefinalize)              | N/A                                                                      |



#### Listenable::constructor
*Syntax:* `new Listenable([{, [initialState: {...}], [validator: {...}], [uniValidator: {...}], [config: {...}]}])`

*Parameters:* optional object, with optional properties: [initialState](#initialstate), [validator](#validator), [uniValidator](#univalidator), [config](#config).

*Simple usage*: `new Listenable()`


##### initialState
*Syntax:* `{ [propName: value[, propName2: value2[, ...[, propNameN: valueN]]]] }`

The initial state, if provided, must be an object. Each property of the object will be set to the listenable when it's created. If a validator or uniValidator is provided to the Listenable, each property/value must be accepted in order to be set.


##### validator
*Syntax:* `{[propName: validateFunction, [propName2, validateFunction2, [, ...[, propNameN: validateFunctionN]]]]}`

*Validate function syntax:* `(value, listenable, propName) => /* truthy or falsy */`

The validator, if provided, must be an object where the property-names corresponding to those expected to be in the listenable. Each property value on the validator must be a function, which accepts or rejects a value. The function receives three arguments, `(value, listenable, propName)`. The value is the tentative new value, the listenable is the listenable to which it may be assigned, and the propName is the name of the property. Usually you only need the value.

Pockito comes with a set of [validators](#validators) that you can use, but you can of course create your own.
<!-- TODO: Link to usage example -->



##### uniValidator
*Syntax:* `(value, listenable, propName) => /* truthy or falsy */`

The uniValidator, if provided, must be a function. The univalidator is used to validate _any_ property on the store. Just like each function on the [validator](#validator), it receives three arguments, `(value, listenable, propName)`. The value is the tentative new value, the listenable is the listenable to which it may be assigned, and the propName is the name of the property.


##### config
*Syntax:* `{[propName: legalValue[, propName2: levalValue2[, ...[propNameN: legalValueN]]]]}`

The config, if provided, must be an object with any or all of the properties listed below. Other properties are not accepted.

The config dictates how the listenable provides warnings when something goes wrong or does not follow best practices. Below is the list of properties which may be set in the config. The default values are denoted by "☑" and possible values are denoted by "☐".

| config propety \ value | 'none' | 'log' | 'throw' |
| ---------------------- | :----: | :---: | :-----: |
| onUndocumentedError    | ☑      | ☐     | ☐       |
| onValidationError      | N/A    | ☑     | ☐       |
| onSameObjectError      | ☐      | ☑     | ☐       |
| onListenerError        | N/A    | ☑     | ☐       |
| onSetSuccess           | ☑      | ☐     | N/A     |

An *undocumentedError* happens when the store receives an undocumented property, i.e. a property for which there is no validator. Note that a listenable with a uniValidator considers all properties as documented. It is possible to have both a `validator` and a `uniValidator`, although it is generally not recommended.

A *validationError* happens when the store receives an invalid property.

A *sameObjectError* happens when the store receives an object or array which was already present. This does not produce a change or notify listeners, although it is possible the object/array was mutated. Check out [this](README.md#note-objects-in-the-store) to avoid this mistake.

A *listenerError* happens when Pockito fails to add or remove a listener. If this happens there is an error in your code, which may prevent your compoents from syncing with the listenable, or cause the listenable to try to notify listeners which no longer exist.



#### Listenable::set
*Syntax:* `listenable.set({ propName: value[, propName2: value2[, ...[propNameN, valueN]]]})`

*Parameters:* object

Each propName/value of the object is set to the listenable. If there is a way to validate the property, the value will only be set if accepted. After successfully setting a propName/value all listeners for that propName is notified.

The way a propName/value is validated is as follows: First the listenable tries to find a specific validator, i.e. a function in it's [validator](#validator) with the corresponding propName. If found, that function decides whether the prop/value is accepted or rejected into the listenable. If there is no specific validator for the propName, it will use it's [uniValidator](#univalidator) if provided. If there is neither a specific validator or a uniValidator to validate the propName/value, it will be accepted, but you can [configure](#config) your listenable so that such events will output to console.



#### Listenable::addListener
*Syntax:* `listenable.addListener(listener[, propName(s)])`

*Parameters:* a function (the listener), and optionally a string (propName) _or_ array of strings (propNames)

The listener will be notified whenever a value is successfully set to that propName of the litenable.

Returns: a method to remove the listener from the listenable.



#### Listenable::removeListener
*Syntax:* `listenable.removeListener(listener[, propName(s)])`

*Parameters:* a function (the listener to remove) and optionally a string (propName) _or_ array of strings (propNames).

Call this method with the same arguments as [addListener](#addlistener) to correctly remove the listener. Optionally, you can use the method returned from addListener.


#### Listenable::isValid
*Syntax:* `listenable.isValid(propName, value)`

*Parameters:* string (propName), any (value)

Does the same check as [set](#set) does to check that a propName/value is accepted to the listenable.

Returns: boolean (accepted)



#### Listenable::reset
*Syntax A:* `listenable.reset(propName)`
*Syntax B:* `listenable.reset([propName[, propName2[, ...[, propNameN]]]])`

*Parameters:* array (propNames) _or_ string (propName)

Resets each propName back to the listenable's [initialState](#initialstate).



#### Listenable::finalize
*Syntax:* `listenable.finalize()`

*Parameters:* Takes no parameters

Makes all properties of the listenable final, disallowing any change to current properties, and disallowing any new properties to be added.






# Validators

Most of the Validators are validator functions which receive `(value, listenable, propName)` and return a truthy value if accepted, falsy otherwise. 

Some of the Validators must be called [with arguments](#validator-creators) to produce a validator function.

| Name                     | Accepted values                                                       |
| ------------------------ | --------------------------------------------------------------------- |
| any                      | any value is accepted                                                 |
| final                    | property cannot be updated after the Listenable is created            |
| boolean                  | must be of type 'boolean'                                             |
| string                   | must be of type 'string' and contain at least one character           |
| number                   | must be of type 'number' and cannot be NaN or Infinity                |
| symbol                   | must be of type 'symbol'                                              |
| func                     | must be of type 'function'                                            |
| object                   | must be of type 'object', not null                                    |
| undef                    | must be of type 'undefined'                                           |
| [undefOr](#undefor)      | must be of type 'undefined' or be accepted by the provided validator  |
| array                    | must be an array                                                      |
| possiblyEmptyString      | must be of type 'string'                                              |
| nullableObject           | must be of type 'object'                                              |
| integer                  | must be an integer                                                    |
| parsableInteger          | must be parsable, resulting in an integer                             |
| parsableNumber           | must be parsable, resulting in a number (not NaN or Infinity)         |
| [oneOf](#oneof)          | must be one of the provided values                                    |
| [oneOfType](#oneoftype)  | must be one of the provided types                                     |
| [arrayOf](#arrayof)      | must be an array, with values accepted by the provided validator      |
| [objectOf](#objectof)    | must be an object, with values accepted by the provided validator     |
| [shape](#shape)          | must be an object, with different validators for each property        |
| [exactShape](#exactshape)| like shape, but does not allow un-validated properties on the object  |


#### Validator creators
This section lists the Validators which must be called with arguments to produce a validator function.


##### undefOr
*Syntax:* `undefOr(validatorFunction)`

Example 1: `undefOr(string)`

Example 2: `undefOr(value => value > 9000)`


##### oneOf
*Syntax:* `oneOf([value[, value2[, ...[, valueN]]]])`

Example: `oneOf('apple', 'pear', 1337)`


##### oneOfType
*Syntax:* `oneOfType([validator[, validator2[, ...[, validatorN]]]])`

*Example:* `oneOfType([string, array])`


##### arrayOf
*Syntax:* `arrayOf(validator)`

*Example:* `arrayOf(string)`


##### objectOf
*Syntax:* `objectOf(validator)`

*Example:* `objectOf(string)`


##### shape
*Syntax:* `shape({ propName: validator[, propName2: validator2[, ...[, propNameN: validatorN]]] })`

*Example:*

```
const person = shape({ name: string, age: number }); // string and number from Pockito.Validators

person({ name: 'eric' }); // false, because age is undefined, i.e. not a number
person({ name: 'eric', age: 5 }); // true
person({ name: 'eric', age: 'five' }); // false, because age is a string, i.e. not a number
person({ name: 'eric', age: '5', interests: ['candy'] }); // true
```


##### exactShape
*Syntax:* `exactShape({ propName: validator[, propName2: validator2[, ...[, propNameN: validatorN]]] })`

*Example:*
```
const person = exactShape({ name: string, age: number }); // string and number from Pockito.Validators

person({ name: 'eric' }); // false, because age is undefined, i.e. not a number
person({ name: 'eric', age: 5 }); // true
person({ name: 'eric', age: 'five' }); // false, because age is a string, i.e. not a number
person({ name: 'eric', age: '5', interests: ['candy'] }); // false, because person should noe have property 'interests'
```
