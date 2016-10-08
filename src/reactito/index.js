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

function listenWhileMountedRemap(component, propsObject) {
    component.state = component.state || {};

    const propsToListenTo = Object.keys(propsObject);
    const mapToNewPropName = (storePropName) => propsObject[storePropName];

    const RemappingStateInjector = (component) => (value, lastValue, propName) => component.setState({ [mapToNewPropName(propName)]: value });

    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(RemappingStateInjector(component), propsToListenTo);

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
    listenWhileMountedRemap,
    Listenable
};
