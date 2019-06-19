import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { socket } from "./socket";
import ProfilePic from "./profilepic";
import Moment from "react-moment";
import "moment-timezone";
import { Container } from "reactstrap";

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
    keyPressed(event) {
        if (event.key == "enter") {
            this.submit();
        }
    }
    submit() {
        socket.emit("chatMessage", this.state.chat);
        this.setState({
            chat: ""
        });
    }

    componentDidMount() {}

    componentDidUpdate() {
        if (this.elemRef.current) {
            this.elemRef.current.scrollTop = this.elemRef.current.scrollHeight;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="chat">
                    <div className="chatScroll" ref={this.elemRef}>
                        <Container>
                            {this.props.chatMessages ? (
                                this.props.chatMessages.map(chat => (
                                    <div
                                        className="followers speech-bubble"
                                        key={chat.msg_id}
                                    >
                                        <Link
                                            className="chatName"
                                            to={`/user/${chat.user_id}`}
                                        >
                                            {chat.first + " " + chat.last}
                                        </Link>

                                        <Moment
                                            className="chatTimeStamp"
                                            format="DD.MM.YYYY HH:mm"
                                        >
                                            {chat.created_at}
                                        </Moment>

                                        <div className="chatMessage">
                                            <ProfilePic
                                                className="chatpic"
                                                imgUrl={chat.avatar}
                                            />
                                            <p className="chatmsg">
                                                {chat.message}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No Users Found</p>
                            )}
                        </Container>
                    </div>
                    <div className="chatWithSend">
                        <textarea
                            className="chatbox"
                            name="chat"
                            id=""
                            value={this.state.chat}
                            onChange={e => this.handleChange(e)}
                            onKeyPress={e => this.keyPressed(e)}
                        />
                        <div
                            className="paperplane"
                            onClick={() => this.submit()}
                        >
                            <i className="far fa-paper-plane fa-2x" />
                        </div>
                    </div>
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
