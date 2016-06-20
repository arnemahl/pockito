import Pockito from './Listenable';

export const StateInjector = (component) => (value, lastValue, propName) => component.setState({ [propName]: value });

export function listenWhileMounted(component, props) {
    const cwun_original = component.componentWillUnmount;
    const unlisten = this.addListener(StateInjector(component), props);

    component.componentWillUnmount = function() {
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
