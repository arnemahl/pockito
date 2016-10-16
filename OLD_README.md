<img src="logo/text-logo-pockito.png" />

## A tiny framework for managing app-state [![Build Status](https://img.shields.io/travis/arnemahl/pockito/master.svg?style=flat)](https://travis-ci.org/arnemahl/pockito) [![npm version](https://img.shields.io/npm/v/pockito.svg?style=flat)](https://www.npmjs.com/package/pockito) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Pockito aims to be a simple and lighweight framework for managing app-state. Pockito gets you started quickly and helps you document and organize app-state.

It comes with a custom [tailoring to React](#tailored-to-react), but you can easily [create your own customizations](#create-your-own-customizations) to suit your needs.

If you want contribute, please make a pull request. :) Any feedback you have would be greatly appreciated.

Check out the [API documentation](API.md) for a full overview.

<!-- Store -->

### Creating your Store

To make it as easy as possible to get started, the minimum setup is designed to be just that: a bare minimum. However, as you app matures Pockito helps you [document](#store-configuration), [validate](#declare-and-validate-store-content) and [organize](#nested-store) your store state to make it more maintainable.


#### Minimum Store setup

When creating a Store, all you need to do is do create a new `Pockito.Listenable`.

```
import {Listenable} from 'pockito';

const Store = new Listenable();
```

Then you are ready to set values to your Store's properties. The `set` function of `Pockito.Listenable`, and hence your store, takes as input an object with properties/values. Here's an example where we set `showLoadingScreen` to `true`.

```
Store.set({
    showLoadingScreen: true
});
```

Then you can read the properties directly off the store: `Store.showLoadingScreen`, or you can [add a listener](#listeners) to always stay in sync with the store.

```
Store.addListener((value) => {/*...*/}, 'showLoadingScreen');
```


#### Declare and validate Store content

Looking at the source code of at Store and seeing what properties/values you can expect it to contain is very useful.

To to document the contents, you can add a `validator` and an `initialState` when creating the store. (Note: You can add an initialState without a validator, but not a validator without an initialState. We suggest you add both.) See [Default validators](#default-validators) for a list of basic validators that come with Pockito.

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

If the Store receives an invalid value for a property, it will simply not be set. Instead, it will result in an exception or a log statement, depending on the Store's [configuration](#store-configuration).

Having added a validator, you can use `Store.isValid('propName', value)` as a verifier for a potential property-value.

Having added an initialState you can use `Store.reset('propName')` to revert a single property to it's initial state, or `Store.reset()` to reset all properties.

It is also possible to add a `uniValidator` instead of a `validator` with which may validate each prop differently. This comes in handy when you don't know the names of the properties you will be assigning to the store. However, if you do know the property names, it's recommended that you use the regular `validator` to document store content.

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

Check out the [API documentation](API.md#config) for a list of all the config options.


#### Default validators

Pockito comes with a set of basic validators that you can [use](#declare-and-validate-store-content). See the [API documentation](API.md#validators) for a full overview.



#### Create your own validators
Validators are just functions: `(value, listenable) => /* true or false*/;`.

This allows you to get pretty creative, and do things such as:

```
new Listenable({
    validator: {
        powerLevel: (value) => value > 9000,
        remainingEnemyHealth: (value, store) => (
            value === store.remainingEnemyHealth - store.powerLevel
            && Math.random() < 0.5
        )
    },
    initialState: {
        powerLevel: 9999,
        remainingEnemyHealth: 1000 * 1000
    }
});
```

The code above only allows `remainingEnemyHealth` to be reduced, by exactly the value of `powerLevel`. Additionally there's only a 50% chance of success.



#### Nested Store

Like in Redux, we recommend having only one Store. As your app-state grows, you can add sub-stores to your Store, to logically organize your app-state.

Creating a sub-store is essentially just creating a new Pockito.Listenable and adding it as a property to the main Store.

```
import {Listenable, Validators} from 'pockito';

Store = new Listenable({
    SubStoreA: new Listenable({
        validator: {
            showLoadingScreen: Validators.boolean
        },
        initialState: {
            showLoadingScreen: true
        }
    }),
    SubStoreB: new Listenable({
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

Note that the config of the base store applies to it's sub-stores as well, so you only need to configure your store once.



<!-- Listeners -->

### Listeners

Pockito makes is easy to create listeners and listen to relevant parts of the app-state. All listeners are [retroactive](#retroactive-listeners) and only get fired upon [effectual changes](#only-fired-upon-actual-changes).

#### How a listener is notified
By default, a when a listener is notified it receives three parameters, 'value', 'previousValue' and 'propName'.

```
listener = (value, previousValue, propName) => { ... }
```

However, you can also use listener middelware which modifies how the change is presented to the listener. One such example is [ReactStateInjector](#tailored-to-react) which makes it super easy to syncronize a React Component's state with the Store.

#### Adding listeners to the Store

When you add listeners you can choose exactly what kinds of changes the listener is interested in.

* `Store.addListener(listener)` ― adds a listener to `Store` which is notified of changes to _any_ value on `Store`.
* `Store.addListener(listener, 'propName')` ― for listening to a single property named 'propName'.
* `Store.addListener(listener, ['propName', 'anotherPropName'])` ― for listening to multiple props.

Being able to specify which properties a listener is notified of has some benefits.

Firstly, listeners will only be fired due to relevant changes. Hence there is no need to check whether or not a change is of relevance to the listener (less code, yay!), and listeners will never be fired only to do nothing because the change is irrelevant.

Secondly it allows you to write custom listeners for each property. There is often times a different respnonse to the update depending on which property was updated, and it typically produces more readable code if each listener only handles one case (rather than catch-all listeners with long switch statements).

#### Removing listeners

There are two ways to remove listeners. One way is to use `removeListener` with the same parameters as you used when adding the listener. Note that you must have the reference to the same _listener_, hence this does not work for inline functions.

```
Store.addListener(listener, 'propName');
...
Store.removeListener(listener, 'propName');
```

Alternatively you can use the method returned from `addListener` to remove the listener. This also works with inline functions.

```
const removeListener = Store.addListener(listener, 'propName');
...
removeListener();
```


#### Retroactive listeners

Once you listen to a resource, e.g. `Store.addListener(listener, 'showLoadingScreen')`, the listener will be 
notified right away if the property `showLoadingScreen` is already present in `Store`. You'll never have to 
write that extra line of code to ensure you get the value if it's already been set.

#### Only fired upon effectual changes

Pockito does not notify listeners unless the new value is different from the old one. This allows you to pipe all changes directly into the view without worrying about wasting resources on non-effectual updates.

##### Note: Objects in the store
Because the Listenable only acceptes effectual changes you cannot modify objects that already exists in the Store. You need to either create a new object with both new and unchanged properties, or perhaps rather create a sub-store for that object.

Creating a new object:

```
Store = new Listenable({
    initialState: {
        participants: {}
    }
});

Store.set({
    participants: {
        ...Store.participants,
        [participantId]: participantName
    }
});

Store.addListener(fn, 'participants');
```

Using a sub-store

```
Store = new Listenable({
    participants: new Listenable() // Participans are a substore complete with addListener(...) and set(...)
});

Store.participants.set({
    [participantId]: participantName
});

Store.participants.addListener(fn);
```


<!-- Reactito -->

## Tailored to React
To tailor Pockito to React, we have created three things, (1) a listener middleware, (2) a listener method `listenWhileMounted` for React.Component instances, and (3) a customized Listenable on which the `listenWhileMouted` method is available.

##### Reactito.StateInjector

If you are using Pockito with React, you can create a customized listener using the method `Pockito.Reactito.StateInjector(reactComponentInstance)`.

```
componentWillMount() {
    this.unListen = Store.addListener(StateInjector(this), 'showLoadingScreen');
}
componentWillUnMount() {
    this.unListen();
}
```

The StateInjector is a one-liner, which put's the changes directly into the component's state for you.

```
StateInjector = (component) => (value, previousValue, propName) => component.setState({ [propName]: value })
```

##### Reactito.listenWhileMounted

However, to make it even simpler, you can use `listenWhileMounted(reactComponent)`. It adds a StateInjector to the component and automatically unlistens when the component unmounts. **NOTE:** Use this method in component*Did*Mount.

```
componentDidMount() {
    Store.listenWhileMounted(this, 'showLoadingScreen');
}
```

The easiest way to make this method available on your Store is to make it a [Reactito.Listenable](#reactito-listenable).

##### Reactito.Listenable

The method `listenWhileMounted` exists on `Pockito.Reactito.Listenable`, which is a customization of the regular `Pockito.Listenable`.

```
import {Reactito} from 'pockito';

Store = new Reactito.Listenable();
```



<!-- Customize -->

## Create your own Customizations

See how the Pockito was tailored to React to get inspiration, source code in [src/reactito](src/reactito/index.js). Note that it's also possible to use your own customizations alongside [Reactito](#tailored-to-react).
