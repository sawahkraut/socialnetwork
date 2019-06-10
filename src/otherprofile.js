import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("componentDidMount");
        const id = this.props.match.params.id;
        axios.get("/otherprofile/" + id).then(({ data }) => {
            // console.log("other profile GET");
            if (data.success == false) {
                this.props.history.push("/");
            } else {
                // console.log("data other profile", data);
                this.setState(data);
            }
        });
    }

    render() {
        // console.log("this.state", this.state);
        return (
            <div className="otherprofile">
                <ProfilePic
                    imgUrl={this.state.avatar}
                    first={this.state.first}
                    last={this.state.last}
                />
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <div>{this.state.bio}</div>
            </div>
        );
    }
}
