import React from "react";

export default function profilePic({ imgUrl, first, clickHandler }) {
    return (
        <img
            src={imgUrl}
            alt={first}
            onClick={clickHandler}
            className="profilepic"
        />
    );
}
