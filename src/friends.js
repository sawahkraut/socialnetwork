import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getListOfFriends, unfriend, addUser, reject } from "./actions";
import ProfilePic from "./profilepic";
import { Button } from "reactstrap";

function Friends(props) {
    useEffect(() => {
        props.dispatch(getListOfFriends());
    }, []);

    function endFriendship(friendId) {
        props.dispatch(unfriend(friendId));
    }

    function acceptFriend(friendId) {
        props.dispatch(addUser(friendId));
    }

    function rejectUser(friendId) {
        props.dispatch(reject(friendId));
    }

    return (
        <React.Fragment>
            <p className="yourfollowers">
                Your Followers ({props.friends && props.friends.length})
            </p>
            <div className="friendlistAccepted">
                {props.friends ? (
                    props.friends.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <ProfilePic imgUrl={friend.avatar} />
                                {friend.first + " " + friend.last}
                            </Link>
                            <Button
                                outline
                                color="info"
                                size="sm"
                                onClick={() => endFriendship(friend.id)}
                            >
                                Unfriend
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No Users Found</p>
                )}
            </div>
            <p className="yourfollowers">
                Pending ({props.pending && props.pending.length})
            </p>
            <div className="friendlistAccepted">
                {props.pending ? (
                    props.pending.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <ProfilePic imgUrl={friend.avatar} />
                                {friend.first + " " + friend.last}
                            </Link>
                            <Button
                                outline
                                color="info"
                                size="sm"
                                onClick={() => acceptFriend(friend.id)}
                            >
                                Accept
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => rejectUser(friend.id)}
                            >
                                Reject
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No Users Found</p>
                )}
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = function(state) {
    return {
        friends:
            state.friends &&
            state.friends.filter(friend => friend.accepted == true),
        pending:
            state.friends &&
            state.friends.filter(pending => pending.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
