import Store from './store';
import { bool, undefOr, string, shape, combine } from './validators';


/** Auth store **/
const auth = Store({
    name: 'auth',
    initialState: {
        loggedIn: false,
        currentUserId: void 0
    },
    validators: {
        loggedIn: bool,
        currentUserId: undefOr(string)
    }
});


/** Store for data about some users **/
const userShape = shape({
    id: string,
    name: string,
    imageUrl: string
});
const user = (value, key, store) => {
    return key === value.id && userShape(value);
};

const users = Store({
    name: 'users',
    initialState: {}
    defaultValidator: user
});


/** Store for data about messages **/
const messageShape = shape({
    text: string,
    senderId: string,
    receiverId: string
});
const message = (value, key, store) => {
    return messageShape(value);
};

const messages = Store({
    name: 'messages',
    initialState: []
    defaultValidator: message
});


/** "Selector" store for messages between specific users **/
function messagesWith(friendId) { // Standard memoization
    let memo = memoMap[friendId];

    if (memo && memo.version === messages.version) {
        return memo.value;
    } else {
        mempMap[friendId] = memo = {
            version: messages.version,
            value: messages.state.filter(message => message.senderId === friendId || message.receiverId === friendId)
        };

        return memo.value;
    }
}

function createStore(friendId) { // Lazy store
    let lazyStore;

    function onMessagesChanged() {
        lazyStore.set(messages.state.filter(message => message.senderId === friendId || message.receiverId === friendId));
    };

    lazyStore = LazyStore({
        name: 'Messages with userId ' + friendId,
        onSync: () => messages.onChange(onMessagesChanged),
        offSync: () => messages.offChange(onMessagesChanged)
    });

    return lazyStore;
}
