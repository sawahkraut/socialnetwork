// describes changes made to Redux aka. the actions
// all ajax requests will go in this file
import axios from "./axios";

export function getListOfFriends() {
    return axios.get("/get-list-friends").then(({ data }) => {
        return {
            type: "ADD_LIST_FRIENDS",
            listFriends: data
        };
    });
}
