<img src="logo/text-logo-pockito.png" />

## A minimalistic approach to shared state [![Build Status](https://semaphoreci.com/api/v1/arnemahl/pockito/branches/master/shields_badge.svg)](https://semaphoreci.com/arnemahl/pockito) [![npm version](https://img.shields.io/npm/v/pockito.svg?style=flat)](https://www.npmjs.com/package/pockito) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

The problem that Pockito helps you solve is sharing state between different parts of your JavaScrip app. There are other, well established libraries you can use (such as [Redux](https://github.com/reactjs/redux)), but Pockito has another take on it. Without sacrificing too much in flexibility, Pockito provides a simpler way to set up and work with shared state.


*Coming right up:*

* [Installation](#installation)
* [Minimalistic shared state](#minimalistic-shared-state)
* [Pockito: Basic use](#pockito-basic-use)
* [Pockito: Advanced features for when your app matures](#pockito-advanced-features)

*Other resources:*

* [Using Pockito with React](README_REACT.md)
* [Pockito compared to Redux](Pockito_vs_Redux.md)
* [API documentation](API.md)



## Installation

Pockito is available through npm:

```shell
npm install pockito --save
```


## Minimalistic shared state

At the bare minimum, facilitating shared state requires just three things:

1. Providing a way to define where the shared state lives
1. Providing a way to listen for changes to the shared state
1. Providing a way to update the shared state (and automatically notify listeners)

In the next section you'll see how Pockito does just this.



## Pockito: Basic use

To create a place for your shared state to live, just import Pockito and create a `new Listenable`. We'll save this app-state container to a constant named `store`.

```javascript
import {Listenable} from 'pockito';

const store = new Listenable();
```

You have now created a `store` to hold your app state. (Note that it contains no initial properties (or values). In simple cases, that's fine: you'll add and update the properties as you go along.)

On your `store` you can now [add listeners](API.md#listenableaddlistener) and [update the state](API.md#listenableset).

```javascript
import {Listenable} from 'pockito';

const store = new Listenable();

// Set new property
store.set({
    showLoadingScreen: true
});

// Listen for any updates
const listener = (newValue, oldValue, propName) => console.log('store value updated:', newValue, oldValue, propName);

store.addListener(listener);

// Listen for updates to `showLoadingScreen`
const listener2 = (showLoadingScreen) => console.log('Show loading screen:', showLoadingScreen);

store.addListener(listener2, 'showLoadingScreen');
```

In the example above, we add a property `showLoadingScreen` with the value `true`. We then add a listener to the store, which logs store state changes to console. We also add another listener, which will only be notified when `showLoadingScreen` is updated. (Being able to create listeners for specific properties can be very useful.)

Now, you may ask "Will those listeners get fired, even though they are added *after* the store is updated?". In fact, yes, they will, because listeners in Pockito are *retroactive*. This allows you not to worry about the order in which the store is updated and the listeners are added.

One last thing to mention, is that Pockito will not fire listeners if you update a property with the same value as before. For example, setting `showLoadingScreen: true` after the listeners are added will not trigger the listeners again, because they already have been notified that `showLoadingScreen` is `true`, and that has not changed.





## Pockito: Advanced features

*First of all, these features aren't really all that advanced, they're just put in a section of their own to make it easier to learn Pockito one step at a time.*

When your app starts to mature you may run into a few problems if you're using just the basic setup (as described in the previous section). The shared state may grow large making it hard to remember what properties exist and what they are named. It can also become quite cluttered if all the shared values, related or not, are at the root level of your `store`. Lastly, you may wan't better control of what happens when something "goes wrong". The folliwing features let you fix these problems in an easy way.

* [Defining an initial state](#defining-an-initial-state)
* [Defining legal values, or types of values, for each property in the store](#defining-legal-values)
* [Splitting up your store into multiple sub-stores](#sub-stores-bundling-related-properties)
* [Configuring error-handling in Pockito](#configuring-pockito)


##### Defining an initial state

To define an initial state, just supply the `initialState` with the properties/values you want when creating a `new Listenable`. Note that the input parameter to `new Listenable` should be either nothing or an object, and as such `initialState` is one of the properties you *may* define on that object.

```javascript
import {Listenable} from 'pockito';

store = new Listenable({
    initialState: {
        showLoadingScreen: true
    }
});
```


##### Defining legal values

Defining legal values or types of values is done in a similar fasion as defining an initial state. Provide a property `validator` when creating your store, with validators functions for the fields you want to validate.

```javascript
import {Listenable, Validators} from 'pockito';

const {boolean} = Validators; // Destructure the `boolean` validator from Pockito's Validators
const divisibleBy1337 = (value) => value % 1337 === 0; // Or create your own validator

store = new Listenable({
    validator: {
        showLoadingScreen: boolean,
        leetK: divisibleBy1337
    }
});
```

When you update a property *that has a validator*, Pockito calls that validator to see if the new value is accepted. If the value is accepted, Pockito sets the value and notifies the listeners. If the value is *not* accepted, Pockito will give you an error (see how in the [config section](#configuring-pockito)).

You can use the [predefined Validators](API.md#validators) that come with Pockito, or create your own. A [validator](API.md#validator) function receives three arguments when called: `(value, listenable, propName)`. In most cases (and in the example above) we only need to use the first one.


##### Sub-stores: Bundling related properties

To make things easy ot manage it's nice to have just one `store`. However, bundling related properties together can make your `store` more manageable. An example of how to do that with Pockito is shown below. In this example we define three properties, `store.showLoadingScreen`, `store.currentUser.id` and `store.currentUser.userName`, two of which are bundled into the sub-store `currentUser`.

```javascript
const store = new Listenable({

    initialState: {
        showLoadingScreen: true
    },
    validator: {
        showLoadingScreen: boolean
    },

    currentUser: new Listenable({
        initialState: {
            id: '',
            userName: ''
        },
        validators: {
            id: possiblyEmptyString,
            userName: possiblyEmptyString
        }
    })
});
```


##### Configuring Pockito
Because the goal of Pockito is to get you started quickly, some of it's logging/error handling features are turned off by default. Here's an example of how to make Pockito log to console whenever the store receives a property with no validator (to help you remember to document all store properties).


```javascript
import {Listenable} from 'pockito';

store = new Listenable({
    config: {
        onUndocumentedError: 'log'
    }
});
```

For a full overview of the available config parameters, see the [config section](API.md#config) of the API documentation.