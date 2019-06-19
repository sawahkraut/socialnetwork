import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { socket } from "./socket";
import ProfilePic from "./profilepic";
import Moment from "react-moment";
import "moment-timezone";
import { Button, Container } from "reactstrap";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.elemRef = React.createRef();
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    keyPress(event) {
        if (event.key == "enter") {
            this.submit();
        }
    }
    submit() {
        socket.emit("chatMessage", this.state.chat);
    }

    componentDidMount() {}

    componentDidUpdate() {
        this.elemRef.current.scrollTop = this.elemRef.current.scrollHeight;
    }

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
                                        <Link to={`/user/${chat.user_id}`}>
                                            <ProfilePic imgUrl={chat.avatar} />
                                            {chat.first + " " + chat.last}

                                            <Moment format="DD.MM.YYYY HH:mm">
                                                {chat.created_at}
                                            </Moment>
                                        </Link>
                                        <div>{chat.message}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Users Found</p>
                        )}
                    </div>

                    <textarea
                        name="chat"
                        id=""
                        cols="30"
                        rows="10"
                        onChange={e => this.handleChange(e)}
                        onKeyPress={e => this.keyPress(e)}
                    />
                    <Button onClick={() => this.submit()}>Send</Button>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("STATE", state);
    return {
        chatMessages: state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
