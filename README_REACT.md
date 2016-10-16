<img src="logo/text-logo-reactito.png" />

## Using Pockito with React

You can customize Pockito to make frequent use cases easier to deal with.
Because I'm a big fan of React, Pockito comes with a customization that makes it easier
to register React components as listeners. (As you may have guessed, I have named it Reactito.)

#### Reactito.Listenable

First off, if you want the benefits of Reactito, use the `Reactito.Listenable` instead of the
standard `Pockito.Listenable`.

```javascript
import { Reactito: {Listenable} } from 'pockito';

const store = new Listenable();
```


#### Listen while mounted

Then, inside a React Component, you can then listen to the store using `listenWhileMounted`.

```javascript
class SomeComponent extends React.Component {
    componentWillMount() {
        store.listenWhileMounted(this, 'someProperty');
    }
    render() {
        const { someProperty } = this.state;

        return <div>{someProperty}</div>;
    }
}
```

`listenWhileMounted` does a few things for you: (1) It ensures your component has a `state`, (2) it injects any properties the component listens into it's state (initially and on each `store` update), and (3) it automatically removes the listener when the component will unmount. To illustrate how this simplifies your code, below is an example of how you'd write it with the regular `Pockito.Listenable`. As you can see, it requires nine lines of code to listen to the `store` instead of just three.

```javascript
class SomeComponent extends React.Component {
    componentWillMount() {
        this.stopListening = store.addListener(this.somePropertyUpdated, 'someProperty');
    }
    componentWillUnmount() {
        this.stopListening();
    }
    somePropertyUpdated = (someProperty) => {
        this.setState({ someProperty });
    }
    render() {
        const { someProperty } = this.state;

        return <div>{someProperty}</div>;
    }
}
```


#### Listen while mounted, but rename properties

`listenWhileMounted` helps us write less code to listen to the `store`, but in some cases we want a property to have one name in the store and another name inside our React component's state. For that we have `listenWhileMountedRemap`:

```javascript
class SomeComponent extends React.Component {
    componentWillMount() {
        store.currentUser.listenWhileMountedRemap(this, { id: 'currentUserId' });
        store.listenWhileMountedRemap(this, { [this.props.storePropName]: 'someProperty' });
    }
    render() {
        const { currentUserId, someProperty } = this.state;

        return <div>{currentUserId} {someProperty}</div>;
    }
}
```
