/*****************************/
/* Store.js                  */
/*****************************/
import {ListenableTailoredForReact: Listenable} from 'pockito';

const Store = new Listenable();

export default Store;

/*****************************/
/* React component           */
/*****************************/
import React from 'react';
import Store from 'store/Store';

class HelloWorldWithToggle extends React.Component {
    componentWillMount() {
        Store.listenWhileMounted(this, 'showHelloWorld');
    }

    toggleHelloWorld = () => {
        Store.set({ showHelloWorld: !Store.showHelloWorld });
    }

    render() {
        return (
            <div>
                <button onClick={this.toggleHelloWorld}>
                    Click me!
                </button>

                {this.state.showHelloWorld &&
                    <div>Hello World!</div>
                }
            </div>
        );
    }
}

/*****************************/
/* Another react component   */
/*****************************/
import React from 'react';
import Store from 'store';

class StatusList extends React.Component {
    componentWillMount() {
        Store.listenWhileMounted(this, 'showHelloWorld', 'showSomethingElse');
    }

    render() {
        return (
            <ul>
                <li>Hello world: <strong>{this.state.showHelloWorld ? 'shown' : 'hidden'}</strong></li>
                <li>Something else: <strong>{this.state.showSomethingElse ? 'shown' : 'hidden'}</strong></li>
            </ul>
        );
    }
}


//====================================================================== //
//   When you want to document what the store contains, do this
//====================================================================== //

/*****************************/
/* Store.js                  */
/*****************************/
import {ListenableTailoredForReact: Listenable} from 'pockito';

const Store = new Listenable({
    validator: {
        showHelloWorld: (value) => typeof value === 'boolean'
        // ^ This documents that the store contains a property 'showHelloWorld', which must be a boolean
    },
    initialState: {
        showHelloWorld: true
    },
    config: {
        onUndocumentedError: 'log' // one of: ['none' (default), 'log', 'throw']
        // ^ This will console.log a warning when setting a value which has no validator.
        // If we try to set the property 'showSomethingElse', it will result in an undocumentedError.
        // This is helpful when you decide it's time to document the state of your Store, while letting
        // you ignore that stuff when you just want to hack something together.
    }
});

export default Store;


//====================================================================== //
// NOTE: The config is passed on to any sub-Listenables of the Store.
// Hence, for nested store, you only need to configure the main store.
//====================================================================== //

const ThirdLevel = new Listenable({/*...*/});
const SecondLevel = new Listenable({
    /*...*/
    ThirdLevel
});
const SomeOtherListenable = new Listenable({/*...*/});

const Store = new Listenable({
    /*...*/
    config: {
        /*...*/
    },

    SecondLevel,
    SomeOtherListenable
});

export default Store;

//====================================================================== //

const Store = new Listenable({
    /*...*/
    config: {
        /*...*/
    },

    SecondLevel: new Listenable({
        /*...*/
        ThirdLevel: new Listenable({/*...*/}),
    }),
    SomeOtherListenable: new Listenable({/*...*/})
});

export default Store;

