# React state management with Pockito

## One library

Pockito lets you do all the things that redux, react-redux
and reselect does, but in different ways.

### Store the truth

Instead of an event-driven approach like redux, pockito has
one type of event: set some variable to property. Thus, we
don't need to think in terms of events.

You may create functions that contains complicated logic
for retrieveing and/or setting data to the store. A lot of
the time, however, you don't need to create any equivalent
of redux's action-creators with pockito, because a lot of
events are simple `set`-operations, which pockito gives
you out of the box.

Lastly, you don't have an equivalent of redux's reducers
in pockito: whenever you set a value to a property, that
is now the new property value. Plain and simple. If you
wish to add a new item to an array, a reducer could do that
for you by returing a new array with all the preivous plus
one new item. Using pockito, the code for doing that would
have to reside inline where you set the new value or in
something like an action-creator if you want to extract
the logic. Thus, any complicated code you might have in
a redux reducer, you would have to put somewhere else
when using pockito.

### Connect components to the store

To connect components to the store you can do it in the
`componentWillMount` function. Say your component depends
on the value of `store.isLoggedIn`:

```
    componentWillMount() {
        store.listenWhileMounted(this, 'isLoggedIn')
    }
```

The value of `store.isLoggedIn` will then be reflected
in that components `state.isLoggedIn`, triggering
re-renders whenever the value changes.

<!-- If you want to move the logic for connecting out of the
component, you can wrap a component around it like this:

```
class Wrapper extends React.Component {
    
    componentWillMount() {
        store.listenWhileMounted(this, 'isLoggedIn')
    }

    render() {
        return <Wrapped {...this.state} />
    }
}
```

Perhaps you want to do it more like in react-redux?

```
// First idea
export default connect(
    (passProps, ownProps) => {
        const fn = () => passProps({
            foo: store.foo,
            bar: store.subStore.bar,
            user: store.users[ownProps.userId],

        });

        store.connect('foo', fn);
        store.subStore.connect('bar', fn);
        store.users.connect(ownProps.userId, fn);
    }
)(Wrapped)

// Second idea, simpler
export default connect(
    (passProps, ownProps) => {
        store.connect('foo', (foo) => passProps({ foo }));
        store.subStore.connect('bar', (bar) => passProps({ bar }));
        store.users.connect(ownProps.userId, (user) => passProps({ user }));
    }
)(Wrapped)

// Third idea, with unsubscribe
export default connect(
    (passProps, props) => {
        const unsubscribers [
            store.connect('foo', (foo) => passProps({ foo })),
            store.subStore.connect('bar', (bar) => passProps({ bar })),
            store.users.connect(props.userId, (user) => passProps({ user }))
        ];

        return unsubscribers;
    }
)(Wrapped);

// Fourth idea
export default connect(
    (passProps, props) => {
        const unsubscribers [
            store.connect(passProps, 'foo'),
            store.subStore.connect(passProps, 'bar'),
            store.users.connect(passProps, props.userId, 'user');
        ];

        return unsubscribers;
    }
)(Wrapped);

// Fifth idea
export default connect(
    (component, props) => {
        store.subscribeWhileMounted(component, 'foo'),
        store.subStore.subscribeWhileMounted(component, 'bar'),
        store.users.subscribeWhileMountedMapTo(component, { user: props.userId });
    }
)(Wrapped);

// Implementation idea of fifth idea
function getConnectWrapper(doConnect, Wrapped) {
    return class Wrapper extends React.Component {
        componentWillMount() {
            doConnect(this, this.props);
        }
        render() {
            return <Wrapped {...this.props} {...this.state} />;
        }
    }
}

const connect = (doConnect) => (Wrapped) => {
    return getConnectWrapper(doConnect, Wrapped);
}
```

-->

One big difference between pockito and redux is that in
pockito you specify which properties of the store state
you want to listen to, while in redux every listener is
fired upon any change to the store state (actually upon
any dispatched action, it does not even need to induce a
change to the state).

This makes the listeners in pockito fire a lot less often,
which is good for performance since the components will
only re-render when they need to (and they don't even have
to shallowCompoare the props and state to ensure this).
However, it also means that the code to connect components
to the store will have to be a bit more specific. It must
define not only how to read store state and pass it to
props, but also which parts of the store state it should
listen to.


### Deriving data

While reselect creates memoized function to derive data,
allowing to delay calculation until the data is needed,
pockito on the other hand uses a push-based approach. This
means that derived values will always be calculated when
their underlying values change, whether any listeners are
subscribed to them or not.

This might seem like a less efficient approach than pull-
based, memoized selectors. However, its worth to note the
following:

With pockito you need to "get" values only when they
change. This is faster than querying a selector every time
anything has changed just in case it affects the output of
that selector (which is what happens with redux +
reselect). Even if selectors are memoized it does not
mean they can withstand thousands of queries within a short
duration without thrashing performance.

Additionally, since pockito only pushes actual changes,
the derived values will not be re-calculated any often than
necessary. Thus, just like memoized selectors, the re-
computation is only carried out when the input changes.


<!--
```
/* Old method for derived state */
const store = new Listenable({
    validator: {
        foo: number,
        bar: number,
        baz: number
    },
    intitialState: {
        foo: 5
    }
});

store.addListener((foo) => store.set({ bar: foo * 2 }), 'foo');
store.addListener((foo, bar) => store.set({ baz: Math.pow(foo, bar) }), 'foo', 'bar');


/* Idea for new derived state syntax */
const store = new Listenable({
    validator: {
        foo: number,
        bar: number,
        baz: number
    },
    initialState: {
        foo: 5
    },
    derivedState: {
        bar: derived('foo', foo => foo * 2),
        baz: derived('foo', 'bar', (foo, bar) => Math.pow(foo, bar))
    }
});
```
-->