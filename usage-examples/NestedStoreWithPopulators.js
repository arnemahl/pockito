import Pockito, {Validate} from 'pockito';
import StoreRefUpdater from 'appState/StoreRefUpdater';
import StoreFirebaseSynchronizer from 'appState/StoreFirebaseSynchronizer';

const DealingConfig: new Pockito.Listenable({
    validator: {
        dealMode: (value) => ['equally', 'differently'].indexOf(value) !== -1,
        dealModes: () => false, // uneditable
        nofCardsForEach: (value) => Number.isInteger(Number.parseFloat(value))
    },
    initialState: {
        dealMode: 'equally',
        dealModes: ['equally', 'differently'],
        nofCardsForEach: 10
    }
});

const Store = new Pockito.Listenable({
    validator: {
        showMatchSettings: Validate.boolean,
        showDealCardsModal: Validate.boolean,
        showChat: Validate.boolean,
        showHand: Validate.boolean,
        showTable: Validate.boolean
    },
    initialState: {
        showMatchSettings: true,
        showDealCardsModal: false,
        showChat: false,
        showHand: true,
        showTable: true
    },
    DealingConfig
});

new StoreRefUpdater(Store);
new StoreFirebaseSynchronizer(Store);


export default new Store();
