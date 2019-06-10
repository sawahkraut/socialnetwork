import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic";

export function FindUsers() {
    // find user state
    const [users, setUsers] = useState([]);
    // search users state
    const [name, setName] = useState("");
    const handleChange = e => {
        setName(e.target.value);
    };
    useEffect(
        () => {
            let abort;
            axios
                .get("/findUsers", {
                    params: {
                        name: name
                    }
                })
                .then(results => {
                    if (!abort) {
                        setUsers(results.data.users);
                        return () => {
                            abort = true;
                        };
                    }
                })
                .catch(err => console.log(err));
        },
        [name]
    );
    return (
        <React.Fragment>
            <div className="usersearch">
                <input
                    className="findpeople"
                    type="text"
                    placeholder="Search for Users"
                    onChange={handleChange}
                />
                <div className="searchedUsers">
                    {users.length &&
                        users.map(user => (
                            <div className="userkey" key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <ProfilePic imgUrl={user.avatar} />
                                    {user.first + " " + user.last}
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </React.Fragment>
    );
}
