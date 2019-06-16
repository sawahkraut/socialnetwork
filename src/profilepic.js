import React from "react";

export default function profilePic(props) {
    // console.log("IMG URLLLL!!!!!: ", props.imgUrl);
    let className = props.className || "profilepic";
    return (
        <img
            className={className}
            src={props.imgUrl}
            alt={props.first}
            onClick={props.clickHandler}
        />
    );
}
