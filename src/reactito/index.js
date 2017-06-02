import PockitoListenable from '../listenable/Listenable';

const StateInjector = (component) => (value, lastValue, propName) => component.setState({ [propName]: value });

function listenWhileMounted(component, props) {
    component.state = component.state || {};

    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(StateInjector(component), props);

    component.componentWillUnmount = function() {
        unlisten();

        if (typeof originalComponentWillUnmount === 'function') {
            originalComponentWillUnmount.bind(component)();
        }
    }.bind(component);
}

/*
 * Usage: store.subscribeWhileMountedMapFrom(this, { storeStatePropName: componentStatePropName });
 */
function listenWhileMountedMapFrom(component, propsObject) {
    component.state = component.state || {};

    const storePropNames = Object.keys(propsObject);
    const mapToComponentPropName = (storePropName) => propsObject[storePropName];

    const RemappingStateInjector = (component) => (value, lastValue, storePropName) => component.setState({ [mapToComponentPropName(storePropName)]: value });

    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(RemappingStateInjector(component), storePropNames);

    component.componentWillUnmount = function() {
        unlisten();

        if (typeof originalComponentWillUnmount === 'function') {
            originalComponentWillUnmount.bind(component)();
        }
    }.bind(component);
}

/*
 * Like listenWhileMountedMapFrom, but key/value in propsObject (2nd argument) are reversed
 *
 * Usage: store.subscribeWhileMountedMapFrom(this, { componentStatePropName: storeStatePropName });
 */
function listenWhileMountedMapTo(component, propsObject) {
    component.state = component.state || {};

    const componentPropNames = Object.keys(propsObject);
    const storePropNames = Object.values(propsObject);
    const mapToComponentPropName = (storePropName) => componentPropNames[storePropNames.indexOf(storePropName)];

    const RemappingStateInjector = (component) => (value, lastValue, storePropName) => component.setState({ [mapToComponentPropName(storePropName)]: value });

    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(RemappingStateInjector(component), storePropNames);

    component.componentWillUnmount = function() {
        unlisten();

        if (typeof originalComponentWillUnmount === 'function') {
            originalComponentWillUnmount.bind(component)();
        }
    }.bind(component);
}

class Listenable extends PockitoListenable {

    constructor(...args) {
        super(...args);
        this.listenWhileMounted = listenWhileMounted.bind(this);
        this.listenWhileMountedRemap = listenWhileMountedRemap.bind(this);
    }
}

module.exports = {
    StateInjector,
    listenWhileMounted,
    listenWhileMountedRemap: listenWhileMountedMapFrom,
    listenWhileMountedMapFrom,
    listenWhileMountedMapTo,
    Listenable
};
