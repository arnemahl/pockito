import PockitoListenable from '../listenable/Listenable';

export const StateInjector = (component) => (value, lastValue, propName) => component.setState({ [propName]: value });

export function listenWhileMounted(component, props) {
    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(StateInjector(component), props);

    component.componentWillUnmount = function() {
        unlisten();

        if (typeof originalComponentWillUnmount === 'function') {
            originalComponentWillUnmount();
        }
    }.bind(component);
}

export function listenWhileMountedRemap(component, propsObject) {
    const propsToListenTo = Object.keys(propsObject);
    const mapToNewPropName = (storePropName) => propsObject[storePropName];

    const RemappingStateInjector = (component) => (value, lastValue, propName) => component.setState({ [mapToNewPropName(propName)]: value });

    const originalComponentWillUnmount = component.componentWillUnmount;
    const unlisten = this.addListener(RemappingStateInjector(component), propsToListenTo);

    component.componentWillUnmount = function() {
        unlisten();

        if (typeof originalComponentWillUnmount === 'function') {
            originalComponentWillUnmount();
        }
    }.bind(component);
}

export class Listenable extends PockitoListenable {

    constructor(...args) {
        super(...args);
        this.listenWhileMounted = listenWhileMounted.bind(this);
        this.listenWhileMountedRemap = listenWhileMountedRemap.bind(this);
    }
}
