import Listenable from './Listenable';
import {ReactStateInjector} from 'listeners/Listeners';

export default class ListenableTailoredToReact extends Listenable {

    listenWhileMounted = (props, component) => {
        const cwun_original = component.componentWillUnmount;
        const unlisten = this.addListener(props, Listeners.ReactStateInjector(component));

        component.componentWillUnmount = () => {
            unlisten();
            cwun_original();
        }.bind(component);
    }
}
