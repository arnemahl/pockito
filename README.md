# Pockito.js – A tiny framework for managing app-state

Pockito aims to be a lighweight framework for managing app-state.

With Pockito it is easy to listen to, create, validate and document app-state.

It comes with a custom [tailoring to React](#tailored-to-react), but you can easily add [your own customizations](tailor-to-your-needs) to suit your needs.



## Features

To help you get started as easily as possible, Pockito has a very simple minimum [setup of your Store](creating-your-store).




### Creating your Store

To make it as easy as possible to get started, the minimum setup is designed to be just that: a bare minimum.


#### Minimum Store setup

When creating a Store, all you need to do is do create a new `Pockito.Listenable`.

```
import {Listenable} from 'pockito';

const Store = new Listenable();
```

Then you are ready to set values to your Store's properties. The `set` function of `Pockito.Listenable`, and hence your store, takes as input an object with properties/values, just like the `setState` function of `React.Component`'s. Here's an example where we set `showLoadingScreen` to `true`.

```
Store.set({
    showLoadingScreen: true
});
```

Then you can read the properties directly off the store: `Store.showLoadingScreen`, or you can [add a listener](#listeners) to always stay in sync with the store.

```
Store.addListener((value) => {/*...*/}, 'showLoadingScreen');
```


<!-- Validator and Initial State -->
#### Declare and validate Store content

Looking at the source code of at Store and seeing what properties/values you can expect it to contain is very useful.

To to document the contents, you can add a `validator` and an `initialState` when creating the store.

```
import {Listenable, Validators} from 'pockito';

Store = new Listenable({
    validator: {
        showLoadingScreen: Validators.boolean
    },
    initialState: {
        showLoadingScreen: true
    }
});
```

Adding a validator documents _that_ a property may exist, and _what_ value it may contain.

If the Store receives an invalid value for a property, it will simply not be set. Instead, it will result in an exception or a log statement, depending on the Store's [configuration](store-configuration).

Having added a validator, you can use `Store.isValid('propName', value)` as a verifier for a potential property-value.

<!-- Config -->
#### Store configuration

Adding a `config` property allows you to dictate how errors are presented.

```
import {Listenable, Validators} from 'pockito';

Store = new Listenable({
    validator: {
        showLoadingScreen: Validators.boolean
    },
    initialState: {
        showLoadingScreen: true
    },
    config: {
        onUndocumentedError: 'log' // default is 'none'
    }
});
```

After setting `onUndocumentedError: 'log'`, Pockito will log to browser console whenever your Store receives a property which doesn't have a validator.
This allows you to put off documenting the Store if you just feel like hacking away until you have a good setup. Once it's time to add documentation, Pockito will remind you of which properties the store contains, so you don't have to worry about forgetting them.

Below is a table of error types you can configure. Note taht default values are denoted by "☑" and possible values are denoted by "☐".

| config propety \ value | 'none' | 'log' | 'throw' |
| ---------------------- | :----: | :---: | :-----: |
| onUndocumentedError    | ☑      | ☐     | ☐       |
| onValidationError      | N/A    | ☑     | ☐       |
| onListenerError        | N/A    | ☑     | ☐       |

As mentioned above, an *undocumentedError* happens when the store receives an undocumented property, i.e. a property for which there is no validator.

A *validationError* happens when the store receives an invalid property.

A *listenerError* happens when Pockito fails to add or remove a listener. If this happens there is an error in your code, which may prevent your compoents from syncing with the Store state, or cause the Store to notify non-existant listeners.





#### Create your own validators
Validators are just functions: `(value, propName, listenable) => /* true or false*/;`.

This allows you to do things such as:

```
Store = new Listenable({
    validator: {
        fruit: (value) => ['apple', 'pear', 'banana'].indexOf(value)
    },
    initialState: {
        fruit: 'apple'
    }
});
```

* NOTE TO SELF: Find a more creative example. Add validator `Pockito.Validators.oneOf(array)`



#### Nested Store

Like in Redux, we recommend having only one Store. As your app-state grows, you can add sub-stores to your Store, to logically organize your app-state.

```
import {Listenable, Validators} from 'pockito';

Store = new Listenable({
    SubStoreA: Listenable.with({
        validator: {
            showLoadingScreen: Validators.boolean
        },
        initialState: {
            showLoadingScreen: true
        }
    }),
    SubStoreB: Listenable.with({
        validator: {
            userName: Validators.string
        },
        initialState: {
            userName: true
        }
    }),
    config: {
        onValidationError: 'throw' // default is 'log'
        onUndocumentedError: 'log' // default is 'none'
    }
});
```

Note that the config of Store applies to SubStoreA and SubStoreB as well.




### Listeners

One of the strenghts of Pockito is that it's easy to create listeners, and listen to relevant parts of the app-state.

#### Easy-to-write listeners

A basic listener looks like this `listener = (nextValue, lastValue, propName) => { ... }`.

#### Simple Listeners

Adding listeners is easy.

`Store.addListener(listener)` adds a listener to `Store` which is notified of changes to any value on `Store`.

You can also choose which props to listen to:

* `Store.addListener(listener, 'propName')` for listening to a single prop, or 
* `Store.addListener(listener, ['propName', 'anotherPropName'])` for listening to multiple props.

Think of the optional second parameter as a filter. This makes it easy to predict which values the 
listeners may receive, and you don't have to worry about the listener being fired for values it's 
not interested in.

#### Retroactive listeners

Once you listen to a resource, e.g. `Store.addListener(listener, 'showLoadingScreen')`, the listener will be 
notified right away if the property `showLoadingScreen` is already present in `Store`. You'll never have to 
write that extra line of code to ensure you get the value if it's already been set.

#### Only be notified upon change

Pockito does not notify you if a property get's updated with the same value as it previously had.




## Tailored to React
If you are using Pockito with React, you can create listeners like this:

```
componentWillMount() {
    this.unListen = Store.addListener(ReactStateInjector(this), 'showLoadingScreen');
}
componentWillUnMount() {
    this.unListen();
}
```

The ReactStateInjector is a oneLiner

```
ReactStateInjector = (component) => (lastValue, nextValue, propName) => component.setState({ [propName]: nextValue })
```

which put's the changes directly into the component's state for you.

If that's not simple enough for you, you can use

```
componentWillMount() {
    Store.listenWhileMounted(this, 'showLoadingScreen');
}
```

which also automatically unlistens when the component unmounts.

For the last one to work you need to use `ListenableTailoredToReact`, which has the method `listenWhileMounted`.

```
import {ListenableTailoredToReact} from 'pockito';

Store = new ListenableTailoredToReact();
```



## Tailor to your needs
See the source code of `Listeners` and `ListenableTailoredToReact` and to see examples of how it can be done.
