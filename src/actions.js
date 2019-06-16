// describes changes made to Redux aka. the actions
// all ajax requests will go in this file
import axios from "./axios";

export function getListOfFriends() {
    return axios.get("/get-friends-list").then(({ data }) => {
        // console.log("ACTIONS!!!!!", data.friends);
        return {
            type: "ADD_LIST_FRIENDS",
            friends: data.friends
        };
    });
}
// friendId is now in object, drnfinh yo backend and to unfriend them
export function unfriend(friendId) {
    let obj = {
        friends: true,
        callId: friendId //
    };
    return axios
        .post("/friends", obj)
        .then(({ data }) => {
            console.log(data);
            if (data.success) {
                return {
                    type: "UNFRIEND",
                    oldFriend: friendId
                };
            }
        })
        .catch(err => console.log(err));
}

export function addUser(friendId) {
    let obj = {
        friends: "pending",
        callId: friendId
    };
    return axios
        .post("/friends", obj)
        .then(({ data }) => {
            console.log("accept friend post", data);
            if (data.success) {
                return {
                    type: "BE_FRIEND",
                    newFriend: friendId
                };
            }
        })
        .catch(err => console.log(err));
}
