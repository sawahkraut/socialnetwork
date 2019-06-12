import React from "react";
import axios from "./axios";
import { Button } from "reactstrap";

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
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
        let obj = {
            friends: this.state.friends,
            callId: this.props.callId
        };
        axios
            .post("/friends", obj)
            .then(({ data }) => {
                this.setState({
                    friendsButton: data.friendsButton,
                    friends: data.friends
                });
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <Button outline color="info" onClick={this.submit}>
                {this.state.friendsButton}
            </Button>
        );
    }
}
