import React from "react";

export default function profilePic(props) {
    return (
        <img
            className="profilepic"
            src={props.imgUrl}
            alt={props.first}
            onClick={props.clickHandler}
        />
    );
}
