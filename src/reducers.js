// functions that will update the Global State

export default function reducer(state = {}, action) {
    if (action.type == "ADD_LIST_FRIENDS") {
        // tell reducer to add list of animals to global state
        // always log your action in your if blocks (otherwise Ivana will yell at me)
        return { ...state, friends: action.friends };
    }
    // filtering the old friends from the global state
    if (action.type == "UNFRIEND") {
        return {
            ...state,
            friends: state.friends.filter(
                friend => friend.id != action.oldFriend
            )
        };
    }
    if (action.type == "BE_FRIEND") {
        // console.log("I made it to BE_FRIEND in reducers", action.newFriend);
        return {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.newFriend) {
                    friend.accepted = true;
                }
                return friend;
            })
        };
    }
    if (action.type == "REJECT") {
        return {
            ...state,
            friends: state.friends.filter(
                friend => friend.id != action.rejectRequest
            )
        };
    }
    // ########################### SOCKET.IO ########################### //

    if (action.type == "LAST_MESSAGES") {
        return { ...state, chatMessages: action.data };
    }
    if (action.type == "NEW_MESSAGE") {
        return { ...state, chatMessages: [...state.chatMessages, action.data] };
    }
    return state;
}
