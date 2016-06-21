import Pockito from 'pockito';
import StoreRefUpdater from 'appState/StoreRefUpdater';
import StoreFirebaseSynchronizer from 'appState/StoreFirebaseSynchronizer';

const {boolean} = Pockito.Validate;

const Store = new Pockito.Listenable({
    validator: {
        showMatchSettings: boolean,
        showDealCardsModal: boolean,
        showChat: boolean,
        showHand: boolean,
        showTable: boolean
    },
    initialState: {
        showMatchSettings: true,
        showDealCardsModal: false,
        showChat: false,
        showHand: true,
        showTable: true
    },

    DealingConfig: new Pockito.Listenable({
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
    })
});

new StoreRefUpdater(Store);
new StoreFirebaseSynchronizer(Store);


export default new Store();
