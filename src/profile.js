import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export class Profile extends React.Component {
    constructor(props) {
        // console.log("PROPS!! :", props);
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="profile-bio">
                <ProfilePic
                    imgUrl={this.props.imgUrl}
                    first={this.props.first}
                    last={this.props.last}
                    clickHandler={this.props.clickHandler}
                />
                <div className="info-container">
                    <div className="biotitle">
                        {this.props.first} {this.props.last}
                    </div>
                    <BioEditor
                        setBio={this.props.setBio}
                        bio={this.props.bio}
                    />
                    <div />
                </div>
            </div>
        );
    }
}
