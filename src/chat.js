import React from "react";
import * as io from "socket.io-client";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { socket } from "./socket";
import ProfilePic from "./profilepic";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    componentDidUpdate() {}

    render() {
        return (
            <React.Fragment>
                <div className="chat">
                    <h2 className="fontfortitle">Chat</h2>
                    <div>
                        {this.props.chatMessages ? (
                            this.props.chatMessages.map(chat => (
                                <div key={chat.msg_id}>
                                    <div className="followers">
                                        <Link to={`/user/${chat.userId}`}>
                                            <ProfilePic imgUrl={chat.avatar} />
                                            {chat.first + " " + chat.last}
                                        </Link>
                                    </div>
                                    {chat.message}
                                    {chat.created_at}
                                </div>
                            ))
                        ) : (
                            <p>No Users Found</p>
                        )}
                    </div>
                    <textarea name="chat" id="" cols="30" rows="10" />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("STATE", state);
    return {
        chatMessages: state.chatMessages,
        chatMessage: state.chatMessage
    };
};

export default connect(mapStateToProps)(Chat);
