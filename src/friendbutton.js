import React from "react";
import axios from "./axios";
import { Button } from "reactstrap";

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const callId = this.props.callId;
        axios
            .get(`/friends/${callId}`)
            .then(({ data }) => {
                this.setState({
                    friendsButton: data.friendsButton,
                    friends: data.friends
                });
            })
            .catch(err => console.log(err));
    }

    submit() {
        // axios
        //     .post("/editbio", { bio: this.state.bio })
        //     .then(results => {
        //         console.log("results ", results);
        //         this.setState({
        //             bioEditorVisible: false
        //         });
        //         this.props.setBio(this.state.bio);
        //     })
        //     .catch(err => {
        //         console.log("profile bioeditor ", err);
        //     });
    }

    render() {
        return (
            <Button outline color="info" onClick={this.submit()}>
                {this.state.friendsButton}
            </Button>
        );
    }
}
