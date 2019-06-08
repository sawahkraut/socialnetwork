import React from "react";

export default function profilePic(props) {
    // console.log("IMG URLLLL!!!!!: ", props.imgUrl);
    return (
        <img
            className="profilepic"
            src={props.imgUrl}
            alt={props.first}
            onClick={props.clickHandler}
        />
    );
}
