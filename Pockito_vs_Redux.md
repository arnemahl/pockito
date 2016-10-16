# Pockito compared to Redux

In this document we'll show how to [create a store with redux](#creating-a-store-with-redux), how to [create a similar store with Pockito](#creating-a-store-with-pockito), list some [broad differences](#main-differences) and top it off with some of the [side effects of simple interaction](#side-effetcs-of-simplicity) with the shared state.



# Creating a store with Redux

State management in Redux consists of four things:

1. **Constants**, or event types
2. **Actions**, or really action creators
3. **Reducers**, who hold the state and update upon certain event types
4. **store**, combines the reducers into one store


### Constants

The constants are used to communicate which event Redux is dispatching.

```javascript
// Constants
const EventTypes = {
    LOGIN_PENDING: 'LOGIN_PENDING',
    LOGIN_SUCCESSFUL: 'LOGIN_SUCCESSFUL',
    LOGIN_FAILED: 'LOGIN_FAILED',
};
```

### Action creators

The action creators communicate what's happening by setting the event type, and
optionally other information (here `data`).

Here's an example of a `login` action-creator.

```javascript
// Action creator
function login(username, password) {
    return (dispatch) => {

        // WHEN YOU START WAITING
        dispatch({
            type: EventTypes.LOGIN_PENDING
        });

        Ajax.post('api/login', {userName, password})
            .then(result => {
                // WHEN YOU GET LOGGED IN
                dispatch({
                    type: EventTypes.LOGIN_SUCCESSFUL,
                    data: result
                });
            })
            .catch(error => {
                // WHEN LOGIN FAILS
                dispatch({
                    type: Actiontypes.LOGIN_FAILED,
                    error: error
                });
            });
    };
}
```

Ignoring the code for network interaction, the actual events that are dispatched are
`LOGIN_PENDING`, `LOGIN_SUCCESSFUL` and `LOGIN_FAILED`, where the latter two also
transmit a second piece of information (`data` or `error`).

```javascript
// when you start waiting
dispatch({
    type: EventTypes.LOGIN_PENDING
});

// when you get logged in
dispatch({
    type: EventTypes.LOGIN_SUCCESSFUL,
    data: result
});

// when login fails
dispatch({
    type: Actiontypes.LOGIN_FAILED,
    error: error
});
```

### Reducers

The reducer(s) get notified of events, and update when they receive events that
are related to their state.

```javascript
// Reducer
function auth(prevState, action) {
    switch (action.type) {
        case EventTypes.LOGIN_PENDING:
            return {
                loggedIn: false,
                pending: true
            };
        case EventTypes.LOGIN_SUCCESSFUL:
            return {
                pending: false,
                loggedIn: true,
                userData: action.data
            };
        case EventTypes.LOGIN_FAILED:
            return {
                pending: false,
                loggedIn: false,
                error: action.error
            };
        default:
            return prevState;
    }
}
```

### The store

Finally, the store gets created by combining the reducers (in this case just one, `auth`).

```javascript
// store
const store = combineReducers([
    auth
]);
```






# Creating a store with Pockito

In Pockito, we don't have any constants to define event types, and we don't have any reducers. If you like, you can create functions to handle actions consistently and help you separate the code, but it's not mandatory.

1. ~~Constants~~
2. **Actions**, *optional*
3. ~~Reducers~~
4. **store**, `new Listenable()`


### Actions

You can, if you like, create functions for executing certain actions. This is useful for actions that are complicated or excecuted at multiple points in your code. (For simple state updates, however, it is often more convenient to just inline the code.)

Here's an example of a `login` action.

```javascript
// Action
function login(username, password) {

    // WHEN YOU START WAITING
    store.auth.reset();
    store.auth.set({
        pending: true
    });

    Ajax.post('api/login', {userName, password})
        .then(result => {
            // WHEN YOU GET LOGGED IN
            store.auth.set({
                pending: false,
                loggedIn: true,
                userData: result
            });
        })
        .catch(error => {
            // WHEN LOGIN FAILS
            store.auth.set({
                pending: false,
                error: error
            });
        });
}
```

Ignoring the code for network interaction, the updates to the store are:

```javascript
// WHEN YOU START WAITING
store.auth.reset();
store.auth.set({
    pending: true
});

// WHEN YOU GET LOGGED IN
store.auth.set({
    pending: false,
    loggedIn: true,
    userData: result
});

// WHEN LOGIN FAILS
store.auth.set({
    pending: false,
    error: error
});
```


### The store

As you know by now, there are different ways to set up a `store` with Pockito.

The quick and simple way:

```javascript
const store = new Listenable();
```

Or the well documented way, with initial state and property validation.

```javascript
const store = new Listenable({
    auth: new Listenable({
        validator: {
            loggedIn: boolean,
            pending: boolean,
            userData: undefOr(shape({
                userId: string,
                userName: string
            }),
            error: undefOr(string),
        },
        initialState: {
            loggedIn: false,
            pending: false,
            userData: void 0,
            error: void 0,
        }
    }),
});
```






# Main differences

### Documenting store state

* Redux: Reducers
* Pockito: Validators

In a Redux store, possible state permutations are documented in each reducers. This typically does not show the possible values of all parameters. For example, if you're wondering about the contents of `auth.userdata`, you have to look at the api endpoint to see what it returns.

In a Pockito store, you can document exactly what kinds of values are allowed on each property. However, you don't necessarily get the clear relationship between different properties that you do in Redux. For example, in our redux example it's clear that you'll have at most one of `auth.data` or `auth.error` at any time. That is less clear in our Pockito example.

### Listening

In Redux you can listen to both events and changes to the store state. In Pockito you can only listen to the store state. Pockito has the advantages that it's listeners are retroactive, and you can specify exactly which properties you want to be notified about.

### Listening to events
Listening to events can be useful, because it is more specific. For example, say you want to sync a field `userName` in the store with the corresponding value in a database, over the network, but faking zero latency by immediately updating the local state. Then you want to push changes to the server whenever the user changes her `userName`, but not when the `userName` changes because it was fetched from the server!

The easy way to solve this (consistently across components of the app) with Redux is to listen for the event that the user changed her userName, and both update local state and push to the server at the same time.

With Pockito you cannot listen for events (Pockito does not have events, remember), but of course, you can create an action which handles both updating the store state and pushes to the server.

### Adding to the store

Whenever you want to expand your Redux store, you will typically have to add new (1) constant, (2) action-creators, (3) reducers and (4) combining the reducers into the store.

With Pockito you only (1) add initial state *if you want to*, (2) add validators *if you want to*.

### Listening to the store state from a React Component

When working with React, Pockito gives you a few extra benefits through [Reactito](README_REACT.md). Let's say we want an input-field which reflects (and updates) a property `userName` in the store. With pockito we just listen for `userName` and update it when the text in the input field changes.

```javascript
class SomeComponent extends React.Component {
    componentWillMount() {
        store.listenWhileMounted(this, 'userName');
    }

    onChange = (event) => {
        store.set({ userName: event.target.value });
    }

    render() {
        const { userName } = this.state;

        return <input type="text" value={userName} onChange={this.onChange} />;
    }
}
```

With redux we need to (1) initialize component state (either explicitly like here, or by dispatching an action after adding the listener) becuase redux subscribe is not retroactive, (2) make sure we unsubscribe when the componend will unmount, (3) dispatch and action to update the `userName`.

```javascript
class SomeComponent extends React.Component {
    state = {
        userName: store.getState().userName
    }

    componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                userName: store.getState().userName
            });
        });
    }
    componentWillUnMount() {
        this.unsubscribe();
    }

    onChange = (event) => {
        store.dispatch(updateUserName(event.target.value));
    }

    render() {
        const { userName } = this.state;

        return <input type="text" value={userName} onChange={this.onChange} />;
    }
}
```



# Side effetcs of simplicity

When something becomes easier to do, that's of course nice. But what's more: When it becomes easier to do something *right*, we tend to do it right *more of the time*.

### Where we add listeners (in React)

As shown, Pockito makes it much easier to manage listeners in React components. When using Redux with React, it can be tempting to have dedicated components that listen for store updates and pass on the state (as props) to other components. That way we don't have to write all that code to add listeners several times. In doing this, however, we remove the definition of the data (in the store) and the presentation of the data (in the component) further apart, thus making it harder to see the full picture.

With Pockito it's so easy to manage listeners that there is typically no reason to listen to the store in one component only to pass the data on to another. We therefore get an explicit relationship between the definition and the presentation of the data.

### What we put in the store

Combining the overhead of listening to specific store properties and that of adding new events, reducers and action-creators, we typically avoid putting simple values into the store when working with Redux. You often fall back to just passing props between components, and although that can work just fine, it will complicate the dependencies between our components and make it harder to reuse and refactor the code.

With Pockito we tend to use the store much more in facilitating communication across components.
