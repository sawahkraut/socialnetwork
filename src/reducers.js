// function that will update the Global State

export default function reducer(state = {}, action) {
    if (action.type == "ADD_LIST_FRIENDS") {
        // tell reducer to add list of animals to global state
        // always log your action in your if blocks (otherwise Ivana will yell at me)
        return { ...state, listFriends: action.listFriends };
    }

    return state;
}
