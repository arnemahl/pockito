import Pockito from './Listenable';

export const StateInjector = (component) => (value, lastValue, propName) => component.setState({ [propName]: value });

export function listenWhileMounted(props, component) {
    const cwun_original = component.componentWillUnmount;
    const unlisten = this.addListener(props, Listeners.StateInjector(component));

    component.componentWillUnmount = () => {
        unlisten();
        cwun_original();
    }.bind(component);
}

export class Listenable extends Pockito.Listenable {

    constructor(...args) {
        super(...args);
        this.listenWhileMounted = listenWhileMounted.bind(this);
    }
}
