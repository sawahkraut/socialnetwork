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
