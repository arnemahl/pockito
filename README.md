# Pockito.js – A tiny framework for managing app-state

Pockito aims to be a lighweight framework for managing app-state.

With Pockito it is easy to listen to, create, validate and document app-state.

It comes with a custom [tailoring to React](#tailored-to-react), but you can easily add [your own customizations](tailor-to-your-needs) to suit your needs.



## Features

Learn how to create listeners and creating a Store for your app-state.

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




### Creating your Store

TODO intro

#### Simple Store
Stores in Pockito can be created as easily as

```
import {Listenable} from 'pockito';

export default new Listenable();
```

#### Declare and validate Store content

Looking at the source code of at Store and seeing what fields it contains is very useful.

To to document the contents, you need to add a `validator` and an `initialState` when creating the store.

* NOTE TO SELF: Enable documenting by initialState only.


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
        onValidationError: 'throw' // default is 'log'
        onUndocumentedError: 'log' // default is 'none'
    }
});
```

Adding a validator documents _that_ a prperty may exist, and _what_ value it may contain.

The *validator* ensures that only values of the correct type are written to the store.
Invalid values will simply not be set, and result in an exception or a log statement, depending on the Store's configuration.

Once you have added a validator, you can use `Store.isValid('userName', value)`, to validate a value before setting it to the store.

The optional `config` property allows you to dictate how errors are presented.


#### Create your own validators
Validators are just functions: `(value, propName, listenable) => /* true or false*/;`.

E.g. you can do:

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

When having a complex app-state it's useful to be able to split your store into multiple sub-stores. It can be done like:

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
